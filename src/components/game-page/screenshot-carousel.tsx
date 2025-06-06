import { useRef, useCallback, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface Screenshot {
  path_full: string;
}

interface Video {
  webm: {
    max: string;
  };
  thumbnail: string;
}

interface ScreenshotCarouselProps {
  screenshots: Screenshot[];
  videos?: Video[];
}

type Slide =
  | { type: "video"; data: Video }
  | { type: "screenshot"; data: Screenshot };

export function ScreenshotCarousel({
  screenshots,
  videos,
}: ScreenshotCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);

    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === index) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const slides: Slide[] = [
    ...(videos || []).map(
      (video) =>
        ({
          type: "video",
          data: video,
        }) as const
    ),
    ...screenshots.map(
      (screenshot) =>
        ({
          type: "screenshot",
          data: screenshot,
        }) as const
    ),
  ];

  const isVisible = (index: number) => Math.abs(index - selectedIndex) <= 1;

  return (
    <div style={{ overflow: "hidden", width: "100%", marginBottom: 32 }}>
      <div className="embla" ref={emblaRef} style={{ overflow: "hidden" }}>
        <div
          className="embla__container"
          style={{
            display: "flex",
            gap: 16,
          }}
        >
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="embla__slide"
              style={{ flex: "0 0 80%", maxWidth: "80%" }}
            >
              {isVisible(idx) ? (
                slide.type === "video" ? (
                  <video
                    ref={(el) => {
                      if (el) {
                        videoRefs.current[idx] = el;
                      }
                    }}
                    src={slide.data.webm.max.replace("http://", "https://")}
                    poster={slide.data.thumbnail}
                    controls
                    muted
                    loop
                    playsInline
                    style={{ width: "100%" }}
                  />
                ) : (
                  <img
                    src={slide.data.path_full}
                    alt={`Screenshot ${idx + 1}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      objectFit: "cover",
                    }}
                  />
                )
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 9",
                    backgroundColor: "#111",
                    borderRadius: 8,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dots + Arrows */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          marginTop: 8,
        }}
      >
        <button
          onClick={scrollPrev}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}
          aria-label="Previous slide"
        >
          <CaretLeft size={24} color="#fff" />
        </button>

        <div style={{ display: "flex", gap: 8 }}>
          {slides.map((_, i) => (
            <span
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              style={{
                display: "inline-block",
                width: i === selectedIndex ? 24 : 10,
                height: 10,
                borderRadius: 9999,
                backgroundColor: i === selectedIndex ? "#fff" : "#555",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
          }}
          aria-label="Next slide"
        >
          <CaretRight size={24} color="#fff" />
        </button>
      </div>
    </div>
  );
}
