import React from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { createTopicServ } from "../../services/courseTopic.services";

function CreateCourseTopic() {
  const navigate = useNavigate();
  const params = useParams();

  // ✅ Validation Schema
  const topicSchema = Yup.object().shape({
    topicName: Yup.string().trim().required("Topic Name is required"),
    srNo: Yup.string().trim().required("Day is required"),
    videoUrl: Yup.string().url("Invalid URL").required("Video URL is required"), // Video URL validation
    assignment: Yup.mixed()
      .required("Assignment Image is required")
      .test("fileFormat", "Only Images (JPG, PNG) are allowed", (value) => {
        const supportedFormats = ["image/jpg", "image/jpeg", "image/png"];
        return value && supportedFormats.includes(value.type);
      }),
    thumbnail: Yup.mixed() // Thumbnail validation
      .required("Thumbnail is required")
      .test("fileFormat", "Only Images (JPG, PNG) are allowed", (value) => {
        const supportedFormats = ["image/jpg", "image/jpeg", "image/png"];
        return value && supportedFormats.includes(value.type);
      }),
  });

  const handleCreateTopic = async (values) => {
    try {
      const formData = new FormData();
      formData.append("topicName", values.topicName);
      formData.append("srNo", values.srNo);
      formData.append("videoUrl", values.videoUrl); // Video URL append kiya
      formData.append("assignment", values.assignment); 
      formData.append("thumbnail", values.thumbnail); // Thumbnail file append kiya
      formData.append("courseId", params?.id);

      let response = await createTopicServ(formData);

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/course-details/" + params?.id);
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
            videoUrl: "", // Initial value
            assignment: null,
            thumbnail: null, // Initial value
          }}
          validationSchema={topicSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await handleCreateTopic(values);
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              {/* Topic & Day Details */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Topic Details</div>
                <div className="form-section-body row g-3 p-3">
                  <div className="col-md-4">
                    <label className="form-label">Topic Name *</label>
                    <Field name="topicName" type="text" className="form-control" />
                    <ErrorMessage name="topicName" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Day/Sr No *</label>
                    <Field name="srNo" type="number" className="form-control" />
                    <ErrorMessage name="srNo" component="div" className="text-danger small" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Video URL *</label>
                    <Field name="videoUrl" type="text" className="form-control" placeholder="https://youtube.com/..." />
                    <ErrorMessage name="videoUrl" component="div" className="text-danger small" />
                  </div>
                </div>
              </div>

              {/* Media Uploads (Thumbnail & Assignment) */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Media Assets</div>
                <div className="form-section-body row g-3 p-3">
                  {/* Thumbnail Input */}
                  <div className="col-md-6">
                    <label className="form-label">Thumbnail Image *</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(event) => {
                        setFieldValue("thumbnail", event.currentTarget.files[0]);
                      }}
                    />
                    <ErrorMessage name="thumbnail" component="div" className="text-danger small" />
                  </div>

                  {/* Assignment Input */}
                  <div className="col-md-6">
                    <label className="form-label">Assignment Image *</label>
                    <input
                      type="file"
                      accept="image/*"
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
                <button type="reset" className="btn btn-secondary me-2">Cancel</button>
                <button className="btn bgThemePrimary" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Topic"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateCourseTopic;