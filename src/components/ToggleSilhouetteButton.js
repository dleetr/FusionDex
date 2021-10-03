import React from "react";
const imgSrc = "https://cdn2.bulbagarden.net/upload/5/5b/Spr_1b_033.png";
export const ToggleSilhouetteButton = ({ preview, togglePreview }) => {
  return (
    <img
      className={`PreviewButton RetroBorder ${preview ? "" : "Silhouette"}`}
      src={imgSrc}
      onClick={togglePreview}
      alt="Nidorino silhouette"
    />
  );
};
