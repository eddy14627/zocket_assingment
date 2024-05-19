class CanvasEditor {
  constructor(canvas, templateData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.templateData = templateData;
  }

  draw(captionText, ctaText, bgColor, uploadedImage) {
    const { image_mask, urls } = this.templateData;

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Set background color
    this.canvas.style.backgroundColor = bgColor;

    // Draw the background pattern
    this.drawPattern(urls.design_pattern);

    // Draw the mask
    this.drawMask(urls.mask, image_mask);

    // Draw the uploaded image if available
    if (uploadedImage) {
      this.drawUploadedImage(uploadedImage, image_mask);
    }

    // Draw the mask stroke
    this.drawStroke(urls.stroke, image_mask);

    // Draw the caption
    this.drawText(
      captionText,
      this.templateData.caption.position,
      this.templateData.caption.font_size,
      this.templateData.caption.text_color,
      this.templateData.caption.alignment,
      this.templateData.caption.max_characters_per_line
    );

    // Draw the CTA button
    this.drawCTA(
      ctaText,
      this.templateData.cta.position,
      this.templateData.cta.text_color,
      this.templateData.cta.background_color
    );
  }

  drawPattern(patternUrl) {
    const patternImg = new Image();
    patternImg.src = patternUrl;
    patternImg.onload = () => {
      this.ctx.drawImage(
        patternImg,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    };
  }

  drawMask(maskUrl, maskPosition) {
    const maskImg = new Image();
    maskImg.src = maskUrl;
    maskImg.onload = () => {
      this.ctx.drawImage(
        maskImg,
        maskPosition.x,
        maskPosition.y,
        maskPosition.width,
        maskPosition.height
      );
    };
  }

  drawStroke(strokeUrl, maskPosition) {
    const strokeImg = new Image();
    strokeImg.src = strokeUrl;
    strokeImg.onload = () => {
      this.ctx.lineWidth = 5;
      this.ctx.drawImage(
        strokeImg,
        0,
        0,
        maskPosition.width + 110,
        maskPosition.height + 490
      );
    };
  }

  drawUploadedImage(imageSrc, maskPosition) {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      // Clip to the mask position
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(
        maskPosition.x,
        maskPosition.y,
        maskPosition.width,
        maskPosition.height
      );
      this.ctx.clip();
      // Draw the image within the mask's position
      this.ctx.drawImage(
        img,
        maskPosition.x,
        maskPosition.y,
        maskPosition.width,
        maskPosition.height
      );
      this.ctx.restore();
    };
  }

  drawText(
    text,
    position,
    fontSize,
    textColor,
    alignment,
    maxCharactersPerLine
  ) {
    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.fillStyle = textColor;
    this.ctx.textAlign = alignment;

    const lines = this.splitTextIntoLines(text, maxCharactersPerLine);
    lines.forEach((line, index) => {
      this.ctx.fillText(line, position.x, position.y + index * fontSize);
    });
  }

  splitTextIntoLines(text, maxCharactersPerLine) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).length <= maxCharactersPerLine) {
        currentLine += `${word} `;
      } else {
        lines.push(currentLine.trim());
        currentLine = `${word} `;
      }
    });
    if (currentLine) lines.push(currentLine.trim());

    return lines;
  }

  drawCTA(text, position, textColor, bgColor) {
    this.ctx.fillStyle = bgColor;
    const w = this.ctx.measureText(text).width;

    this.ctx.roundRect(position.x, position.y, w + 100, 100, [30]);

    this.ctx.fill();

    this.ctx.fillStyle = textColor;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, position.x + w / 2 + 50, position.y + 50);
  }
}

export default CanvasEditor;
