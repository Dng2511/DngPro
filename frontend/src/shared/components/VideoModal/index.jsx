import { useEffect, useRef } from "react";
import * as dashjs from "dashjs";

const VideoModal = ({ open, onClose }) => {
  const videoRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (!open || !videoRef.current) return;

    const player = dashjs.MediaPlayer().create();
    player.initialize(
      videoRef.current,
      "https://dngpro.xyz/api/stream/manifest.mpd",
      true
    );

    return () => {
      player.reset();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => e.target === backdropRef.current && onClose()}
      className="video-modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        overflowY: "auto",
      }}
    >
      <div
        className="video-modal-content"
        style={{
          width: "90vw",
          maxWidth: 1200,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          borderRadius: 20,
          color: "#fff",
          position: "relative",
          boxShadow: "0 25px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
          animation: "modalFadeIn 0.3s ease-out",
        }}
      >
        {/* Decorative gradient overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 200,
            background: "linear-gradient(180deg, rgba(229, 9, 20, 0.15) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Close button */}
        <button
          onClick={onClose}
          className="close-btn"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 40,
            height: 40,
            background: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            fontSize: 20,
            cursor: "pointer",
            zIndex: 3,
            borderRadius: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#e50914";
            e.target.style.transform = "rotate(90deg) scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(0, 0, 0, 0.7)";
            e.target.style.transform = "rotate(0deg) scale(1)";
          }}
        >
          ✕
        </button>

        {/* Content */}
        <div
          className="video-info-wrapper"
          style={{
            display: "flex",
            gap: 30,
            padding: 30,
            alignItems: "stretch",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Trailer */}
          <div style={{ flex: "0 0 60%" }}>
            <div
              style={{
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
              }}
            >
              <video
                ref={videoRef}
                controls
                autoPlay
                muted
                style={{
                  width: "100%",
                  display: "block",
                  background: "#000",
                }}
              />
            </div>
          </div>

          {/* Movie info */}
          <div
            style={{
              flex: "0 0 40%",
              padding: "6px 6px 6px 6px",
            }}
          >
            <h2
              style={{
                margin: "0 0 12px 0",
                color: "#fff",
                fontSize: 26,
                fontWeight: 700,
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
              }}
            >
              🔥 Frieren - Pháp sư tiễn táng
            </h2>

            <p
              style={{
                color: "#ccc",
                lineHeight: 1.6,
                marginBottom: 12,
                paddingLeft: 16,
                paddingRight: 16,
              }}
            >
              Sau một thập kỷ phiêu lưu, Frieren cùng tổ đội của dũng sĩ Himmel đã đánh bại Ma vương và mang lại hòa bình cho thế giới. Thế rồi cô ấy, một Elf với thọ mệnh hơn cả ngàn năm tuổi, lập lời hứa sẽ tái ngộ cùng nhóm Himmel rồi lên đường đi phiêu lưu một mình. 50 năm sau, Frieren đến thăm Himmel, nhưng lúc này anh ta đã già và chỉ còn lại một chút thời gian ngắn ngủi. Chứng kiến cái chết của Himmel, Frieren hối hận vì đã không “tìm hiểu nhiều hơn về con người”, và thế là một chuyến phiêu lưu mới của cô với mục đích trên đã bắt đầu. Trên chuyến phiêu lưu này, cô đã gặp gỡ rất nhiều người và trải qua rất nhiều sự kiện.
            </p>

            <div style={{ marginBottom: 18, color: "#aaa" }}>
              🎬 Thể loại: Hành động – Khoa học viễn tưởng
            </div>

            {/* CTA */}
            <a
              href="https://www.youtube.com/watch?v=u0t4jAlRA4M&list=PLdM751AKK4aPt-L1NtFn99KdiKdYKJKAX"
              target="_blank"
              rel="noopener noreferrer"
              className="watch-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "14px 28px",
                background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 8,
                textDecoration: "none",
                boxShadow: "0 4px 15px rgba(229, 9, 20, 0.4)",
                transition: "all 0.3s ease",
                marginTop: "auto",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 6px 25px rgba(229, 9, 20, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 4px 15px rgba(229, 9, 20, 0.4)";
              }}
            >
              <span style={{ fontSize: 16 }}>▶</span>
              Xem ngay tại đây
            </a>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style>
        {`
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(20px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .video-modal-backdrop {
            animation: backdropFadeIn 0.3s ease-out;
          }

          @keyframes backdropFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @media (max-width: 768px) {
            .video-info-wrapper {
              flex-direction: column !important;
            }
            .video-info-wrapper > div {
              flex: 1 1 100% !important;
            }
            .video-modal-content {
              max-width: 95vw !important;
            }
          }

          @media (max-width: 480px) {
            .video-info-wrapper {
              padding: 20px !important;
              gap: 20px !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default VideoModal;
