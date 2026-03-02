import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { X, Check, Crop } from "lucide-react";

const ImageCropperModal = ({ image, onCrop, onClose, aspectRatio = 1 }) => {
    const cropperRef = useRef(null);

    const handleCrop = () => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            // Get the natural crop data to determine proper output size
            const cropData = cropper.getData(true);

            // Use a minimum output size for clarity, but never upscale beyond original
            const minWidth = 800;
            const minHeight = 800;

            // Calculate output dimensions: use natural crop size, but ensure minimum resolution
            let outputWidth = Math.max(cropData.width, minWidth);
            let outputHeight = Math.max(cropData.height, minHeight);

            // Cap maximum to prevent huge base64 strings
            const maxDimension = 1600;
            if (outputWidth > maxDimension || outputHeight > maxDimension) {
                const scale = maxDimension / Math.max(outputWidth, outputHeight);
                outputWidth = Math.round(outputWidth * scale);
                outputHeight = Math.round(outputHeight * scale);
            }

            const croppedCanvas = cropper.getCroppedCanvas({
                width: outputWidth,
                height: outputHeight,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high',
            });

            // Output as high-quality JPEG
            onCrop(croppedCanvas.toDataURL('image/jpeg', 0.92));
        }
    };

    return (
        <div className="modal-overlay" style={{ zIndex: 11000 }}>
            <div className="modal-content" style={{ maxWidth: "650px", padding: "1.5rem" }}>
                <div className="modal-header">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--campus-blue)' }}>
                        <Crop size={22} /> Crop Image
                    </h2>
                    <button className="close-btn" onClick={onClose}><X /></button>
                </div>

                <div style={{ margin: "1.5rem 0", background: "#f0f0f0", borderRadius: "12px", overflow: "hidden" }}>
                    <Cropper
                        src={image}
                        style={{ height: 420, width: "100%" }}
                        initialAspectRatio={aspectRatio}
                        aspectRatio={aspectRatio}
                        guides={true}
                        ref={cropperRef}
                        viewMode={1}
                        minCropBoxWidth={100}
                        minCropBoxHeight={100}
                        background={false}
                        responsive={true}
                        autoCropArea={0.92}
                        checkOrientation={false}
                        zoomOnWheel={true}
                        zoomOnTouch={true}
                    />
                </div>

                <p style={{ color: '#999', fontSize: '0.8rem', textAlign: 'center', margin: '0 0 1rem' }}>
                    Drag to reposition • Scroll to zoom • Drag corners to resize crop
                </p>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }} onClick={handleCrop}>
                        <Check size={20} /> Apply Crop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropperModal;
