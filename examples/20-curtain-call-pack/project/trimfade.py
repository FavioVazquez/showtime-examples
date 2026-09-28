"""Cap a one-shot at LEN seconds with a FADE-second raised-cosine fade-out; print envelope peak time."""
import sys, numpy as np, soundfile as sf
src, dst, L, F = sys.argv[1], sys.argv[2], float(sys.argv[3]), float(sys.argv[4])
x, sr = sf.read(src, always_2d=True)
def env_peak(y):
    m = np.abs(y).max(axis=1); w = int(0.02 * sr)
    e = np.sqrt(np.convolve(m ** 2, np.ones(w) / w, mode='same')); return e.argmax() / sr, 20 * np.log10(e.max() + 1e-12), e
t0, pk, e = env_peak(x)
n = min(len(x), int(round(L * sr))); y = x[:n].copy(); f = int(F * sr)
y[n - f:] *= (0.5 + 0.5 * np.cos(np.linspace(0, np.pi, f)))[:, None]
print(src, 'len', round(len(x)/sr, 3), 'env peak', round(t0, 3), 'level at cap', round(20*np.log10(e[n-1]+1e-12) - pk, 1), 'dB rel')
sf.write(dst, y, sr, subtype=sf.info(src).subtype)
t1, _, e2 = env_peak(y); print(dst, 'len', round(len(y)/sr, 3), 'env peak', round(t1, 3), 'last 20ms', round(20*np.log10(np.abs(y[-int(.02*sr):]).max()+1e-12), 1), 'dBFS')
