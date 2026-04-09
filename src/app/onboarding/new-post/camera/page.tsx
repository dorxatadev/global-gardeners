"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function FlashIcon({ on }: { on: boolean }) {
  return (
    <Image
      alt=""
      aria-hidden="true"
      className="h-6 w-6"
      height={24}
      src={on ? "/icons/flash-on.svg" : "/icons/flash-off.svg"}
      width={24}
    />
  );
}

function SwitchCameraIcon() {
  return (
    <Image alt="" aria-hidden="true" className="h-6 w-6" height={24} src="/icons/toggle-camera.svg" width={24} />
  );
}

function GalleryIcon() {
  return (
    <Image alt="" aria-hidden="true" className="h-6 w-6" height={24} src="/icons/gallery.svg" width={24} />
  );
}

export default function CameraOnboardingPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [flashOn, setFlashOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkOnboardingStatus() {
      const response = await fetch("/api/profile/onboarding-status");
      if (!response.ok) {
        return;
      }

      const status = (await response.json()) as { nextStep?: string };
      if (!isMounted || !status.nextStep) {
        return;
      }

      if (status.nextStep !== "/onboarding") {
        router.replace(status.nextStep);
      }
    }

    void checkOnboardingStatus();
    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setErrorMessage("Camera is not supported on this device/browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const [videoTrack] = stream.getVideoTracks();
        trackRef.current = videoTrack ?? null;

        if (videoTrack) {
          const capabilities = videoTrack.getCapabilities() as MediaTrackCapabilities & {
            torch?: boolean;
          };
          setTorchSupported(Boolean(capabilities.torch));
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch {
        setErrorMessage("Camera permission denied or unavailable.");
      }
    };

    void startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      trackRef.current = null;

    };
  }, []);

  useEffect(() => {
    const orientation = (typeof screen !== "undefined"
      ? screen.orientation
      : null) as (ScreenOrientation & {
      lock?: (
        orientation:
          | "any"
          | "natural"
          | "landscape"
          | "portrait"
          | "portrait-primary"
          | "portrait-secondary"
          | "landscape-primary"
          | "landscape-secondary",
      ) => Promise<void>;
    }) | null;

    if (!orientation?.lock) {
      return;
    }

    void orientation
      .lock(isLandscape ? "landscape" : "portrait")
      .catch(() => {
        // Orientation lock is not available on all devices/browser contexts.
      });
  }, [isLandscape]);

  useEffect(() => {
    const applyTorch = async () => {
      const track = trackRef.current;
      if (!track || !torchSupported) return;

      try {
        await track.applyConstraints({
          advanced: [{ torch: flashOn } as MediaTrackConstraintSet],
        });
      } catch {
        setErrorMessage("Flash is not available on this camera.");
        setFlashOn(false);
      }
    };

    void applyTorch();
  }, [flashOn, torchSupported]);

  const handleFlashToggle = () => {
    if (!torchSupported) {
      setErrorMessage("Flash is not supported on this device.");
      return;
    }
    setFlashOn((current) => !current);
  };

  const fileToDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }
        reject(new Error("Unable to read file."));
      };
      reader.onerror = () => reject(new Error("Unable to read file."));
      reader.readAsDataURL(file);
    });

  const handleGallerySelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (!files.length) return;

    try {
      const dataUrls = await Promise.all(files.map((file) => fileToDataUrl(file)));
      const rawDraftPhotos = sessionStorage.getItem("ggDraftPostPhotos");
      const draftPhotos = rawDraftPhotos ? (JSON.parse(rawDraftPhotos) as unknown) : [];
      const existing = Array.isArray(draftPhotos)
        ? draftPhotos.filter((value): value is string => typeof value === "string")
        : [];
      const merged = [...existing, ...dataUrls].slice(0, 5);
      sessionStorage.setItem("ggDraftPostPhotos", JSON.stringify(merged));
      router.push("/onboarding/new-post");
    } catch {
      setErrorMessage("Unable to load selected photos.");
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video || !cameraReady) {
      setErrorMessage("Camera is not ready yet.");
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      setErrorMessage("Unable to capture photo.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      setErrorMessage("Unable to capture photo.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);
    const capturedDataUrl = canvas.toDataURL("image/jpeg", 0.92);
    sessionStorage.setItem("ggCapturedPhoto", capturedDataUrl);
    router.push("/onboarding/new-post/confirm");
  };

  const previewOrientationClass = isLandscape
    ? "rotate-90 scale-[1.35]"
    : "rotate-0 scale-100";

  return (
    <main className="client-main min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf7_0%,_#f8f6f1_50%,_#efe9dc_100%)] px-0 sm:grid sm:place-items-center sm:px-8">
      <section className="client-shell relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden border border-[#e7e0d2] bg-white shadow-[0_24px_80px_rgba(56,71,45,0.12)]">
        <header className="client-header relative z-10 flex items-center justify-between border-b border-black/10 bg-white p-4">
          <Link
            href="/onboarding/new-post"
            aria-label="Close camera"
            className="inline-flex h-10 w-10 items-center justify-center transition"
          >
            <Image src="/icons/back-button.svg" alt="" aria-hidden="true" width={40} height={40} className="h-10 w-10" />
          </Link>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleFlashToggle}
              aria-label={flashOn ? "Flash on" : "Flash off"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-[#333333] disabled:opacity-60"
              disabled={!cameraReady}
            >
              <FlashIcon on={flashOn} />
            </button>
            <button
              type="button"
              onClick={() => setIsLandscape((current) => !current)}
              aria-label={
                isLandscape
                  ? "Switch preview to portrait"
                  : "Switch preview to landscape"
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f5] text-[#333333]"
            >
              <SwitchCameraIcon />
            </button>
          </div>
        </header>

        <div className="relative flex-1 bg-black">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className={`absolute inset-0 block h-full w-full min-h-full min-w-full transition-transform duration-300 ${previewOrientationClass} ${cameraReady ? "opacity-100" : "opacity-0"}`}
            style={{ objectFit: "cover" }}
          />
          {!cameraReady ? (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-[14px] font-medium text-white/90">
              {errorMessage || "Starting camera..."}
            </div>
          ) : null}

          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-lg border border-black/10 bg-white px-4 py-3 text-center text-[14px] font-medium leading-5 text-[#333333]">
            Take or choose a photo to share.
          </div>
        </div>

        <footer className="relative z-10 h-24 border-t border-[#e5e5e5] bg-white px-4 py-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
          <div className="grid h-full grid-cols-3 items-center">
            <button
              type="button"
              className="justify-self-start rounded-lg px-1 py-1 text-[#333333]"
              aria-label="Open gallery"
              onClick={() => galleryInputRef.current?.click()}
            >
              <span className="flex flex-col items-center gap-1 text-[12px] font-medium leading-4">
                <GalleryIcon />
                Gallery
              </span>
            </button>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGallerySelect}
              className="hidden"
            />

            <button
              type="button"
              aria-label="Capture photo"
              className="justify-self-center"
              onClick={handleCapture}
            >
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#3f7a49] ring-4 ring-[#f2f2f2]">
                <span className="h-[54px] w-[54px] rounded-full border-[3px] border-[#d7ead9]" />
              </span>
            </button>

            <span aria-hidden="true" />
          </div>
        </footer>
      </section>
    </main>
  );
}

