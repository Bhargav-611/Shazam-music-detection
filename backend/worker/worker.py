import time
from db.fingerprint_dao import FingerprintDAO
from db.connection import get_connection
from utils.youtube_downloader import download_youtube_audio
from main_pipeline import main_pipeline

TEMP_DIR = "temp_audio"

while True:
    conn = get_connection()
    cur = conn.cursor()

    print("Checking for pending songs...")

    cur.execute("""
        SELECT id, audio_url
        FROM songs
        WHERE status = 'PENDING'
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    """)
    row = cur.fetchone()

    print("Fetched row:", row)

    if not row:
        cur.close()
        conn.close()
        time.sleep(10)
        continue

    song_id, youtube_url = row

    print(f"Processing song_id: {song_id}, youtube_url: {youtube_url}")

    cur.execute(
        "UPDATE songs SET status='PROCESSING' WHERE id=%s",
        (song_id,)
    )
    conn.commit()
    cur.close()
    conn.close()

    try:
        audio_path, title = download_youtube_audio(youtube_url, TEMP_DIR)

        print("Downloaded audio to:", audio_path)

        fingerprints = main_pipeline(audio_path, youtube_url=youtube_url, song_id=song_id)

        print(title)

        print("Updating song status to COMPLETED")

        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE songs SET status='COMPLETED', title=%s WHERE id=%s",
            (title, song_id)
        )
        print("Fingerprints inserted:", len(fingerprints))
        conn.commit()
        cur.close()
        conn.close()

    except Exception as e:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE songs SET status='FAILED' WHERE id=%s",
            (song_id,)
        )
        conn.commit()
        cur.close()
        conn.close()
