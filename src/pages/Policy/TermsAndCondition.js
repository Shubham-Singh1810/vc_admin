import React, { useEffect, useState } from "react";
// import SunEditor from "suneditor-react";
// import "suneditor/dist/css/suneditor.min.css";
import {
  getSupportDetailsServ,
  updateSupportDetailsServ,
} from "../../services/support.service";
import { toast } from "react-toastify";

function TermsAndCondition() {
  const [formData, setFormData] = useState({
    termsAndCondition: "",
    _id: "",
  });
  const [editorKey, setEditorKey] = useState(0); // SunEditor re-render key

  const getSupportDetails = async () => {
    try {
      let response = await getSupportDetailsServ();
      if (response?.data?.statusCode == "200") {
        setFormData({
          termsAndCondition: response?.data?.data?.termsAndCondition,
          _id: response?.data?.data?._id,
        });
        setEditorKey((prev) => prev + 1); // SunEditor ko re-render karne ke liye
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSupportDetails();
  }, []);

  const updateSupportDetailsFunc = async () => {
    try {
      let response = await updateSupportDetailsServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getSupportDetails();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container-fluid">
      <div className="col-lg-12 p-4">
        <h5 className="ms-1 mb-3">Terms And Condition</h5>
        {/* <SunEditor
          key={editorKey} // important
          setContents={formData.termsAndCondition}
          onChange={(content) =>
            setFormData({ ...formData, termsAndCondition: content })
          }
          height="400px"
          setOptions={{
            placeholder: "Start typing...",
            buttonList: [
              [
                "undo",
                "redo",
                "font",
                "fontSize",
                "formatBlock",
                "paragraphStyle",
                "blockquote",
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
                "fontColor",
                "hiliteColor",
                "textStyle",
                "removeFormat",
                "outdent",
                "indent",
                "align",
                "horizontalRule",
                "list",
                "lineHeight",
                "table",
                "link",
                "image",
                "video",
                "audio",
                "imageGallery",
                "fullScreen",
                "showBlocks",
                "codeView",
                "preview",
                "print",
              ],
            ],
          }}
        /> */}
        <button
          className="bgThemePrimary btn w-100 mt-2"
          onClick={updateSupportDetailsFunc}
          disabled={!formData.termsAndCondition}
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default TermsAndCondition;
