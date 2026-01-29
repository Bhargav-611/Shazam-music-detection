export async function convertToWav(audioBlob: Blob): Promise<Blob> {
    const audioContext = new AudioContext();
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const numChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const samples = audioBuffer.length;
    const buffer = new ArrayBuffer(44 + samples * numChannels * 2);
    const view = new DataView(buffer);

    function writeString(view: DataView, offset: number, string: string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    let offset = 0;

    writeString(view, offset, "RIFF"); offset += 4;
    view.setUint32(offset, 36 + samples * numChannels * 2, true); offset += 4;
    writeString(view, offset, "WAVE"); offset += 4;
    writeString(view, offset, "fmt "); offset += 4;
    view.setUint32(offset, 16, true); offset += 4;
    view.setUint16(offset, 1, true); offset += 2;
    view.setUint16(offset, numChannels, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, sampleRate * numChannels * 2, true); offset += 4;
    view.setUint16(offset, numChannels * 2, true); offset += 2;
    view.setUint16(offset, 16, true); offset += 2;
    writeString(view, offset, "data"); offset += 4;
    view.setUint32(offset, samples * numChannels * 2, true); offset += 4;

    for (let i = 0; i < samples; i++) {
        for (let ch = 0; ch < numChannels; ch++) {
            let sample = audioBuffer.getChannelData(ch)[i];
            sample = Math.max(-1, Math.min(1, sample));
            view.setInt16(offset, sample * 0x7fff, true);
            offset += 2;
        }
    }

    return new Blob([view], { type: "audio/wav" });
}
