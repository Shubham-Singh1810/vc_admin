import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// In services ko apne actual path se replace karein
import { getCategoryServ } from "../../services/category.service";
import { getSubCategoryServ } from "../../services/subCategory.service";
import { getInstructorServ } from "../../services/instructor.services";
import { addBatchServ } from "../../services/batch.services";

function CreateBatch() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);

  // 1. Initial Values as per Schema
  const initialValues = {
    name: "",
    status: "upcoming",
    image: "",
    categoryId: "",
    subCategoryId: "",
    startDate: "",
    endDate: "",
    duration: "",
    description: "",
    instructorId: "",
    price: "",
    discountedPrice: "",
    rating: 0,
    meetingLink: "",
    isCertified:""
  };

  // 2. Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Batch name is required"),
    status: Yup.string().oneOf(["ongoing", "upcoming", "completed"]).required(),
    image: Yup.mixed().required("Image is required"),
    categoryId: Yup.string().required("Category is required"),
    subCategoryId: Yup.string().required("Sub-Category is required"),
    startDate: Yup.string().required("Start date is required"),
    endDate: Yup.string().required("End date is required"),
    duration: Yup.string().required("Duration is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().positive().required("Price is required"),
    discountedPrice: Yup.number().min(0).required("Discounted price is required"),
    isCertified: Yup.string().required("Required Field"),
    meetingLink: Yup.string().url("Invalid URL").required("Meeting link is required"),
  });

  // 3. Fetch Data for Dropdowns
  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [catRes, instRes] = await Promise.all([
        getCategoryServ({ status: true }),
        getInstructorServ({ status: true })
      ]);
      if (catRes?.data?.statusCode == 200) setCategories(catRes.data.data);
      if (instRes?.data?.statusCode == 200) setInstructors(instRes.data.data);
    } catch (error) {
      console.error("Error fetching dropdowns", error);
    }
  };

  // SubCategory fetch jab Category change ho
  const handleCategoryChange = async (catId, setFieldValue) => {
    setFieldValue("categoryId", catId);
    setFieldValue("subCategoryId", ""); // reset subcat
    try {
      const res = await getSubCategoryServ({ categoryId: catId });
      if (res?.data?.statusCode === 200) setSubCategories(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 4. Handle Submit
  const handleSubmit = async (values) => {
    setSubmitBtnLoader(true);
    try {
      const fd = new FormData();
      Object.keys(values).forEach((key) => {
        fd.append(key, values[key]);
      });

      const response = await addBatchServ(fd);
      if (response?.data?.statusCode === 200) {
        toast.success("Batch Created Successfully!");
        navigate("/all-batches");
      } else {
        toast.error(response?.data?.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Failed to create batch");
    } finally {
      setSubmitBtnLoader(false);
    }
  };

  // 5. UI Sections
  const batchSections = [
    {
      title: "Basic Information",
      fields: [
        { label: "Batch Image", name: "image", type: "file", required: true },
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
          options: categories.map(c => ({ value: c._id, label: c.name })),
          required: true,
          isCategory: true // Custom flag
        },
        {
          label: "Sub Category",
          name: "subCategoryId",
          type: "select",
          options: subCategories.map(s => ({ value: s._id, label: s.name })),
          required: true,
        },
      ],
    },
    {
      title: "Schedule & Pricing",
      fields: [
        { label: "Start Date", name: "startDate", type: "date", required: true },
        { label: "End Date", name: "endDate", type: "date", required: true },
        { label: "Duration (e.g. 3 Months)", name: "duration", type: "select", required: true, options: [{value:"45 Days", label:"45 Days"}, {value:"3 Months", label:"3 Months"}, {value:"6 Months", label:"6 Months"}] },
        { label: "Price", name: "price", type: "number", required: true },
        { label: "Discounted Price", name: "discountedPrice", type: "number", required: true },
        { label: "Instructor", name: "instructorId", type: "select", options: instructors.map(i => ({ value: i._id, label: i.firstName+" "+i.lastName })) },
      ],
    },
    {
      title: "Additional Details",
      fields: [
         { label: "Is course certified?", name: "isCertified", type: "select", required: true, options: [{value:true, label:"Yes"}, {value:false, label:"No"}] },
        { label: "Meeting Link", name: "meetingLink", type: "text", required: true },
       
        { label: "Description", name: "description", type: "textarea", required: true },
        
      ],
    },
  ];

  return (
    <div className="container-fluid p-4">
      <h5 className="mb-3">Create New Batch</h5>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => (
          <Form>
            {batchSections.map((section, idx) => (
              <div className="form-section shadow-sm mb-4" key={idx}>
                <div className="form-section-header fw-bold mb-3">{section.title}</div>
                <div className="form-section-body row g-3">
                  {section.fields.map((f, i) => (
                    <div className="col-md-6" key={i}>
                        {values[f.name + "Prev"] && f.type === "file" && (
                            <div>

                                <img src={values[f.name + "Prev"]} alt="preview" className="img-thumbnail mt-2" style={{ height: "100px" }} />
                            </div>
                      )}
                      <label className="form-label">{f.label} {f.required && <span className="text-danger">*</span>}</label>
                      
                      {f.type === "select" ? (
                        <Field 
                          as="select" 
                          name={f.name} 
                          className="form-control"
                          onChange={(e) => {
                            if(f.isCategory) handleCategoryChange(e.target.value, setFieldValue);
                            else setFieldValue(f.name, e.target.value);
                          }}
                        >
                          <option value="">Select</option>
                          {f.options?.map((opt, j) => (
                            <option key={j} value={opt.value}>{opt.label}</option>
                          ))}
                        </Field>
                      ) : f.type === "file" ? (
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => {
                            setFieldValue(f.name, e.target.files[0]);
                            setFieldValue(f.name + "Prev", URL.createObjectURL(e.target.files[0]));
                          }}
                        />
                      ) : f.type === "textarea" ? (
                        <Field as="textarea" name={f.name} className="form-control" rows="3" />
                      ) : (
                        <Field type={f.type} name={f.name} className="form-control" />
                      )}
                      
                      
                      <ErrorMessage name={f.name} component="div" className="text-danger mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button type="submit" className="btn bgThemePrimary w-100 text-white" disabled={submitBtnLoader}>
              {submitBtnLoader ? "Creating Batch..." : "Create Batch"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateBatch;