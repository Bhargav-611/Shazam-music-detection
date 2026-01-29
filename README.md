# Swara - Audio Fingerprinting Music Recognition

Swara is a **Shazam-like music recognition application** that identifies songs using advanced audio fingerprinting technology. The system allows users to recognize songs from microphone input or add new songs to the database via YouTube URLs.

## 🎵 What Does This Project Do?

- **🎤 Song Recognition**: Record audio through your microphone and identify matching songs from the database
- **🎬 YouTube Integration**: Add new songs to the database by providing YouTube URLs
- **🔊 Audio Fingerprinting**: Uses spectrogram analysis and peak detection to create unique "fingerprints" for each song
- **⚡ Real-time Processing**: Fast matching algorithm that compares audio fingerprints efficiently
- **🌐 Modern Web Interface**: Beautiful, responsive Next.js frontend with scroll animations and glassmorphism design

## 🏗️ Architecture

The project consists of two main components:

### Backend (Python/FastAPI)
- **Audio Processing**: Converts audio to spectrograms and extracts peaks
- **Fingerprinting**: Creates unique hashes from audio peaks using constellation mapping
- **Database**: PostgreSQL stores songs and their fingerprints
- **API**: FastAPI endpoints for song recognition and YouTube uploads
- **Background Tasks**: Celery workers process long-running audio fingerprinting tasks

### Frontend (Next.js/React)
- **Interactive UI**: Scroll-based animations with Framer Motion
- **Song Recognition**: Browser-based audio recording and real-time feedback
- **YouTube Upload**: Interface to add songs via YouTube URLs
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** and npm
- **PostgreSQL** database
- **Redis** (for Celery task queue)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Bhargav-611/Swara-music-detection.git
cd Swara-music-detection/code
```

### 2. Backend Setup

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

**Note**: The main `requirements.txt` in the `code` directory has the core dependencies. Additional backend-specific dependencies may be in `backend/requirements.txt`.

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/swara_db
REDIS_URL=redis://localhost:6379/0
```

#### Set Up the Database

1. Create a PostgreSQL database named `swara_db`
2. The application will automatically create the required tables on first run

#### Start the Backend Server

```bash
# From the backend directory
python main.py
```

The API will be available at `http://localhost:8000`

#### Start Celery Worker (Optional, for background tasks)

In a separate terminal:

```bash
cd backend
celery -A worker.celery_app worker --loglevel=info
```

### 3. Frontend Setup

#### Install Dependencies

```bash
cd ../frontend_4
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend_4` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

#### Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

#### Build for Production

```bash
npm run build
```

This creates an optimized static export in the `out` directory.

## 📁 Project Structure

```
code/
├── backend/                    # Python FastAPI backend
│   ├── Detection/             # Audio processing modules
│   ├── db/                    # Database operations
│   ├── utils/                 # Helper utilities
│   ├── worker/                # Celery background tasks
│   ├── api.py                 # API endpoints
│   ├── main.py                # FastAPI application entry point
│   ├── fingerprint.py         # Fingerprinting logic
│   └── requirements.txt       # Python dependencies
│
├── frontend_4/                # Next.js frontend
│   ├── app/                   # Next.js app directory
│   │   ├── page.tsx          # Main landing page
│   │   └── layout.tsx        # Root layout
│   ├── components/           # React components
│   │   ├── HeadphoneScroll.tsx    # Scroll animation
│   │   ├── ShazamModal.tsx        # Recognition modal
│   │   ├── SongRecognition.tsx    # Microphone recording
│   │   ├── YouTubeUpload.tsx      # YouTube URL input
│   │   ├── Navbar.tsx             # Navigation bar
│   │   └── Footer.tsx             # Footer
│   ├── lib/                  # Utilities
│   │   ├── api.ts            # API client
│   │   └── wavConverter.ts   # Audio conversion
│   ├── public/               # Static assets
│   │   ├── frames/           # Animation frames (192 images)
│   │   └── logo.png          # Brand logo
│   └── package.json          # Node dependencies
│
├── data/                     # Data files and exports
└── requirements.txt          # Core Python dependencies
```

## 🔧 Audio Fingerprinting Configuration

The fingerprinting algorithm uses the following parameters (from `README.md`):

- **Sample Rate**: 44100 Hz
- **Channels**: Mono
- **Format**: WAV
- **FFT Window Size**: 4096
- **Hop Length**: 2048
- **Window Function**: Hann
- **Neighborhood Size**: 20 × 20
- **Minimum Amplitude**: -40 dB
- **Fan-out (targets per anchor)**: 5
- **Min Time Delta**: 0.5 sec
- **Max Time Delta**: 3.0 sec

## 🌐 Deployment

### Frontend (Render Static Site)

1. **Build Command**: `npm install && npm run build`
2. **Publish Directory**: `code/frontend_4/out`
3. **Root Directory**: `code/frontend_4`
4. **Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: Your deployed backend URL

### Backend (Render Web Service)

1. **Build Command**: `pip install -r requirements.txt`
2. **Start Command**: `cd backend && python main.py`
3. **Environment Variables**:
   - `DATABASE_URL`: PostgreSQL connection string
   - `REDIS_URL`: Redis connection string (if using Celery)

## 🛠️ Technologies Used

### Backend
- FastAPI - Modern Python web framework
- PostgreSQL - Relational database
- Celery - Distributed task queue
- Redis - Message broker
- NumPy & SciPy - Numerical computing
- Librosa - Audio analysis
- yt-dlp - YouTube audio extraction

### Frontend
- Next.js 14 - React framework
- TypeScript - Type safety
- Tailwind CSS - Styling
- Framer Motion - Animations
- HTML5 Audio API - Browser recording

## 📝 API Endpoints

- `POST /recognize_song` - Recognize a song from audio file
- `POST /upload_youtube_song` - Add a song from YouTube URL
- `GET /` - Health check

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Bhargav**
- GitHub: [@Bhargav-611](https://github.com/Bhargav-611)
**Tilak**
- GitHub: [@Tilak-1604](https://github.com/Tilak-1604)

---

**Note**: Make sure PostgreSQL and Redis are running before starting the backend services.
