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
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "90vw",
          maxWidth: 1100,
          margin: "40px auto",
          background: "#000",
          borderRadius: 12,
          color: "#fff",
          position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.6)",
            color: "#fff",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
            zIndex: 3,
          }}
        >
          ✕
        </button>

        {/* Content */}
        <div
          className="video-info-wrapper"
          style={{
            display: "flex",
            gap: 24,
            padding: 24,
            alignItems: "stretch",
          }}
        >
          {/* Trailer */}
          <div style={{ flex: "0 0 60%" }}>
            <video
              ref={videoRef}
              controls
              autoPlay
              muted
              style={{
                width: "100%",
                borderRadius: 10,
                background: "#000",
              }}
            />
          </div>

          {/* Movie info */}
          <div
            style={{
              flex: "0 0 40%",
              padding: "6px 6px 6px 6px",
            }}
          >
            <h2 style={{ margin: "0 0 12px 0" }}>
              🔥 TÊN PHIM: Frieren - Pháp sư tiễn táng
            </h2>

            <p style={{ color: "#ccc", lineHeight: 1.6, marginBottom: 12 }}>
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
              style={{
                display: "inline-block",
                padding: "12px 20px",
                background: "#e50914",
                color: "#fff",
                fontWeight: 600,
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              ▶ Xem ngay tại đây
            </a>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style>
        {`
          @media (max-width: 768px) {
            .video-info-wrapper {
              flex-direction: column;
            }
          }
        `}
      </style>
    </div>
  );
};

export default VideoModal;
