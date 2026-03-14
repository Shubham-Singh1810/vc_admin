import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryServ } from "../../services/category.service";
import { getSubCategoryServ } from "../../services/subCategory.service";
import { getInstructorServ } from "../../services/instructor.services";
import {
getCourseDetailsServ,
updateCourseServ
} from "../../services/course.services"
import Skeleton from "react-loading-skeleton";

function UpdateCourse() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);

  // Form values state (Data fetch hone ke baad update hoga)
  const [batchData, setBatchData] = useState(null);

  // 1. Validation Schema (Image update ke waqt optional ho sakti hai)
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Batch name is required"),
    status: Yup.string().oneOf(["ongoing", "upcoming", "completed"]).required(),
    categoryId: Yup.string().required("Category is required"),
    subCategoryId: Yup.string().required("Sub-Category is required"),
    
    duration: Yup.string().required("Duration is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().positive().required("Price is required"),
    isCertified: Yup.string().required("Required Field"),
    discountedPrice: Yup.number()
      .min(0)
      .required("Discounted price is required"),
   
  });

  // 2. Fetch Initial Data
  useEffect(() => {
    fetchDropdownData();
    fetchBatchDetails();
  }, [id]);

  const fetchDropdownData = async () => {
    try {
      const [catRes, instRes] = await Promise.all([
        getCategoryServ({ status: true }),
        getInstructorServ({ status: true }),
      ]);
      if (catRes?.data?.statusCode == 200) setCategories(catRes.data.data);
      if (instRes?.data?.statusCode == 200) setInstructors(instRes.data.data);
    } catch (error) {
      console.error("Error fetching dropdowns", error);
    }
  };

  // ... existing imports ...

  const fetchBatchDetails = async () => {
    try {
      const response = await getCourseDetailsServ(id);
      if (response?.data?.statusCode === 200) {
        const rawData = response.data.data;

        // ✅ Data ko Flatten karein: Object ki jagah sirf ID nikaalein
        const formattedData = {
          ...rawData,
          categoryId: rawData.categoryId?._id || "",
          subCategoryId: rawData.subCategoryId?._id || "",
          instructorId: rawData.instructorId?._id || "",
          // Image preview ke liye purana URL store karein
          imagePrev: rawData.image,
        };

        setBatchData(formattedData);

        // Category ID milte hi Sub-Categories fetch karein
        if (formattedData.categoryId) {
          fetchSubCategories(formattedData.categoryId);
        }
      }
    } catch (error) {
      toast.error("Failed to load batch details");
    }
  };

  // ... handleSubmit aur baki UI same rahega ...

  const fetchSubCategories = async (catId) => {
    try {
      const res = await getSubCategoryServ({ categoryId: catId });
      if (res?.data?.statusCode === 200) setSubCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCategoryChange = async (catId, setFieldValue) => {
    setFieldValue("categoryId", catId);
    setFieldValue("subCategoryId", "");
    fetchSubCategories(catId);
  };

  // 3. Handle Update Submit
  const handleSubmit = async (values) => {
  setSubmitBtnLoader(true);
  try {
    const fd = new FormData();

    // 1. Un keys ki list jinhe humein NAHI bhejna hai
    const excludedFields = ["createdAt", "updatedAt", "__v", "imagePrev"];

    Object.keys(values).forEach((key) => {
      // Skip excluded fields
      if (excludedFields.includes(key)) return;

      // Skip image agar wo string hai (matlab user ne nayi photo select nahi ki)
      if (key === "image" && typeof values[key] === "string") return;

      // Baki sab fields append karein
      fd.append(key, values[key]);
    });

    // 2. Update service call (ID pass karna mat bhoolna agar service requirement hai)
    const response = await updateCourseServ(fd); 

    if (response?.data?.statusCode == 200) {
      toast.success(response?.data?.message);
      navigate("/courses");
    } else {
      toast.error(response?.data?.message || "Something went wrong!");
    }
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message);
  } finally {
    setSubmitBtnLoader(false);
  }
};

  if (!batchData)
    return (
      <div className="p-4">
        {[1, 2, 3, 4]?.map((v, i)=>{
            return(
                <div className="row mb-4 border p-2 py-4 bg-light rounded shadoe">
          {[1, 2, , 3, 4]?.map((v, i) => {
            return (
              <div className="col-6 mb-3">
                <Skeleton width={100} />
                <div>
                  <Skeleton height={30} />
                </div>
              </div>
            );
          })}
        </div>
            )
        })}
        
      </div>
    );

  // Sections configuration (Create jaisa hi)
  const batchSections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Batch Image", name: "image", type: "file", required: false }, // Update mein optional
        { label: "Batch Name", name: "name", type: "text", required: true },
        {
          label: "Status",
          name: "status",
          type: "select",
          options: [
            { value: "upcoming", label: "Upcoming" },
            { value: "ongoing", label: "Ongoing" },
            { value: "completed", label: "Completed" },
          ],
          required: true,
        },
        {
          label: "Category",
          name: "categoryId",
          type: "select",
          options: categories.map((c) => ({ value: c._id, label: c.name })),
          required: true,
          isCategory: true,
        },
        {
          label: "Sub Category",
          name: "subCategoryId",
          type: "select",
          options: subCategories.map((s) => ({ value: s._id, label: s.name })),
          required: true,
        },
      ],
    },
    {
      title: "Schedule & Pricing",
      fields: [
        
        { label: "Duration (e.g. 3 Months)", name: "duration", type: "select", required: true, options: [{value:"45 Days", label:"45 Days"}, {value:"3 Months", label:"3 Months"}, {value:"6 Months", label:"6 Months"}] },
        { label: "Price", name: "price", type: "number", required: true },
        {
          label: "Discounted Price",
          name: "discountedPrice",
          type: "number",
          required: true,
        },
        {
          label: "Instructor",
          name: "instructorId",
          type: "select",
          options: instructors.map((i) => ({
            value: i._id,
            label: i.firstName + " " + i.lastName,
          })),
        },
      ],
    },
    {
      title: "Additional Details",
      fields: [
        { label: "Is course certified?", name: "isCertified", type: "select", required: true, options: [{value:true, label:"Yes"}, {value:false, label:"No"}] },
       
        {
          label: "Description",
          name: "description",
          type: "textarea",
          required: true,
        },
      ],
    },
  ];

  return (
    <div className="container-fluid p-4">
      <h5 className="mb-3">Update Course</h5>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...batchData,
          imagePrev: batchData.image,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form>
            {batchSections.map((section, idx) => (
              <div className="form-section shadow-sm mb-4" key={idx}>
                <div className="form-section-header fw-bold mb-3">
                  {section.title}
                </div>
                <div className="form-section-body row g-3">
                  {section.fields.map((f, i) => (
                    <div className="col-md-6" key={i}>
                      {/* Preview Logic */}
                      {(values[f.name + "Prev"] ||
                        (f.type === "file" && values[f.name])) &&
                        f.type === "file" && (
                          <div>
                            <img
                              src={
                                typeof values[f.name] === "object"
                                  ? URL.createObjectURL(values[f.name])
                                  : values[f.name]
                              }
                              alt="preview"
                              className="img-thumbnail mt-2"
                              style={{ height: "100px" }}
                            />
                          </div>
                        )}

                      <label className="form-label">
                        {f.label}{" "}
                        {f.required && <span className="text-danger">*</span>}
                      </label>

                      {f.type === "select" ? (
                        <Field
                          as="select"
                          name={f.name}
                          className="form-control"
                          onChange={(e) => {
                            if (f.isCategory)
                              handleCategoryChange(
                                e.target.value,
                                setFieldValue,
                              );
                            else setFieldValue(f.name, e.target.value);
                          }}
                        >
                          <option value="">Select</option>
                          {f.options?.map((opt, j) => (
                            <option key={j} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Field>
                      ) : f.type === "file" ? (
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => {
                            setFieldValue(f.name, e.target.files[0]);
                          }}
                        />
                      ) : f.type === "textarea" ? (
                        <Field
                          as="textarea"
                          name={f.name}
                          className="form-control"
                          rows="3"
                        />
                      ) : (
                        <Field
                          type={f.type}
                          name={f.name}
                          className="form-control"
                        />
                      )}

                      <ErrorMessage
                        name={f.name}
                        component="div"
                        className="text-danger mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="btn bgThemePrimary w-100 text-white"
              disabled={submitBtnLoader}
            >
              {submitBtnLoader ? "Updating Course..." : "Update Course"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default UpdateCourse;
