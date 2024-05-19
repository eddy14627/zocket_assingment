import React, { useEffect, useRef, useState } from "react";
import templateData from "./templateData";
import CanvasEditor from "./CanvasEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faStar } from "@fortawesome/free-regular-svg-icons";
import { SketchPicker } from "react-color";
import eyeDropper from "./eye-dropper-solid.svg";

const CanvasComp = () => {
  const canvasRef = useRef(null);
  const canvasEditorRef = useRef(null);
  const [caption, setCaption] = useState(templateData.caption.text);
  const [cta, setCta] = useState(templateData.cta.text);
  const [bgColor, setBgColor] = useState("#0369A1");
  const [showPicker, setShowPicker] = useState(false);
  const [recentColors, setRecentColors] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  //   useEffect(() => {
  //     const canvas = canvasRef.current;
  //     canvasEditorRef.current = new CanvasEditor(canvas, templateData);
  //     // eslint-disable-next-line
  //   }, [templateData]);

  //   useEffect(() => {
  //     if (canvasEditorRef.current)
  //       canvasEditorRef.current.draw(caption, cta, bgColor, uploadedImage);
  //   }, [caption, cta, bgColor, uploadedImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvasEditorRef.current = new CanvasEditor(canvas, templateData);
    if (canvasEditorRef.current)
      canvasEditorRef.current.draw(caption, cta, bgColor, uploadedImage);
  }, [caption, cta, bgColor, uploadedImage, templateData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (canvasEditorRef.current) {
          canvasEditorRef.current.draw(caption, cta, bgColor, uploadedImage);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [caption, cta, bgColor, uploadedImage]);

  const handleColorChangeComplete = (color) => {
    setBgColor(color.hex);
    setRecentColors((prevColors) => {
      const newColors = [
        color.hex,
        ...prevColors.filter((c) => c !== color.hex),
      ];
      return newColors.slice(0, 5);
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEyePicker = async () => {
    if (window.EyeDropper) {
      const eyeDropper = new window.EyeDropper();
      try {
        const pick = await eyeDropper.open();
        handleColorChangeComplete({ hex: pick.sRGBHex });
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("EyeDropper API is not supported in your browser");
    }
  };

  return (
    <div className="flex flex-col xl:flex-row h-screen w-full items-center">
      <div className="w-full xl:w-1/2 2xl:w-2/5 h-screen flex justify-center bg-slate-200 items-center py-20">
        <canvas
          ref={canvasRef}
          width="1080"
          height="1080"
          style={{ height: 400, width: 400, backgroundColor: bgColor }}
        ></canvas>
      </div>
      <div className="flex h-screen justify-center flex-col w-full md:w-4/5 xl:w-1/2 2xl:w-3/5 items-center py-14 px-14 sm:px-20 2xl:px-48 gap-10">
        <div className="flex flex-col items-center">
          <p className="font-semibold text-xl">Ad Customization</p>
          <p className="text-gray-400 text-center">
            Customise your ad and get the templates accordingly
          </p>
        </div>
        <div className="flex items-center gap-5 border px-4 py-2 border-gray-300 rounded-lg w-full">
          <FontAwesomeIcon
            icon={faImage}
            style={{
              "--fa-primary-color": "#2b6bda",
              "--fa-secondary-color": "#2b6bda",
            }}
          />
          <p className="flex gap-2 items-center">
            Change the ad Creative image
            <label
              className="font-bold text-blue-700 underline cursor-pointer"
              htmlFor="imageInput"
            >
              Select File
            </label>
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </p>
        </div>
        <div className="flex w-full items-center gap-2">
          <hr className="flex-1" />
          <p className="text-gray-400 text-center flex">Edit Content</p>
          <hr className="flex-1" />
        </div>
        <div className="flex items-start gap-2 border px-4 py-2 border-gray-300 rounded-lg w-full justify-between">
          <label className="mb-2 font-bold text-xs flex-1 flex-col gap-2">
            Caption Text:
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="font-normal text-sm w-full"
            />
          </label>
          <FontAwesomeIcon
            icon={faStar}
            style={{
              "--fa-primary-color": "#2b6bda",
              "--fa-secondary-color": "#2b6bda",
            }}
          />
        </div>
        <div className="flex items-start gap-2 border px-4 py-2 border-gray-300 rounded-lg w-full justify-between">
          <label className="mb-2 font-bold text-xs flex-1 flex-col gap-2">
            Call to Action:
            <input
              type="text"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
              className="font-normal text-sm w-full"
            />
          </label>
          <FontAwesomeIcon
            icon={faStar}
            style={{
              "--fa-primary-color": "#2b6bda",
              "--fa-secondary-color": "#2b6bda",
            }}
          />
        </div>
        <div className="relative flex justify-around self-start w-full">
          <div className="flex flex-col gap-5">
            <p className="text-gray-400 text-center flex">Choose your color</p>
            <div className="flex items-center gap-2">
              {recentColors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full border cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => setBgColor(color)}
                ></div>
              ))}
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                +
              </button>
            </div>
            {showPicker && (
              <div className="absolute top-24">
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                  onClick={() => setShowPicker(false)}
                />
                <SketchPicker
                  color={bgColor}
                  onChangeComplete={handleColorChangeComplete}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-5 items-center">
            <p className="text-gray-400 text-center flex">
              Pick Color from page
            </p>
            <span onClick={handleEyePicker}>
              <img alt="eyepicker" className="h-5 w-5" src={eyeDropper} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasComp;
