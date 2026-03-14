import React from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { createTopicServ } from "../../services/topic.services";

function CreateTopic() {
  const navigate = useNavigate();
  const params = useParams();

  // ✅ Image Validation Schema
  const topicSchema = Yup.object().shape({
    topicName: Yup.string().trim().required("Topic Name is required"),
    srNo: Yup.string().trim().required("Day is required"),
    assignment: Yup.mixed()
      .required("Image Assignment is required")
      .test("fileFormat", "Only Images (JPG, PNG) are allowed", (value) => {
        // Sirf image formats check karein
        const supportedFormats = ["image/jpg", "image/jpeg", "image/png"];
        return value && supportedFormats.includes(value.type);
      }),
  });

  const handleCreateTopic = async (values) => {
    try {
      const formData = new FormData();
      formData.append("topicName", values.topicName);
      formData.append("srNo", values.srNo);
      formData.append("assignment", values.assignment); 
      formData.append("batchId", params?.id);

      let response = await createTopicServ(formData);

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/batch/" + params?.id);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Error creating topic");
    }
  };

  return (
    <div className="container-fluid">
      <div className="col-lg-12 p-4">
        <h5 className="ms-1 mb-4">Create New Topic</h5>

        <Formik
          initialValues={{
            topicName: "",
            srNo: "",
            assignment: null,
          }}
          validationSchema={topicSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await handleCreateTopic(values);
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Topic Details</div>
                <div className="form-section-body row g-3 p-3">
                  <div className="col-md-6">
                    <label className="form-label">Topic Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="topicName"
                      onChange={(e) => setFieldValue("topicName", e.target.value)}
                    />
                    <ErrorMessage name="topicName" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Day *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="srNo"
                      onChange={(e) => setFieldValue("srNo", e.target.value)}
                    />
                    <ErrorMessage name="srNo" component="div" className="text-danger small" />
                  </div>
                </div>
              </div>

              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Assignment (Image)</div>
                <div className="form-section-body row g-3 p-3">
                  <div className="col-md-12">
                    <label className="form-label">Upload Image *</label>
                    <input
                      type="file"
                      accept="image/*" // ✅ Browser image files hi show karega
                      className="form-control"
                      onChange={(event) => {
                        setFieldValue("assignment", event.currentTarget.files[0]);
                      }}
                    />
                    <ErrorMessage name="assignment" component="div" className="text-danger small" />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end mb-5 mt-4">
                <button type="reset" className="btn btn-danger me-2">Cancel</button>
                <button className="btn bgThemePrimary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateTopic;