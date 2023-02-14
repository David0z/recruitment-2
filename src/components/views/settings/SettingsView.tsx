import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRef, useState, useContext, useEffect } from "react";
import { ToastContext, ToastContextProps } from "../../view/View";
import { User } from '../users/UsersView';
import { ViewsContext, ViewsContextProps, Views } from "../../../App";

const schema = yup.object({
  name: yup.string().min(3).max(50).required(),
  username: yup.string().min(3).max(50).required(),
  email: yup.string().email().required(),
  phone: yup
    .string()
    .min(6)
    .max(30)
    .nullable()
    .transform((_, val) => (val === Number(val) ? val : null)),
  street: yup.string(),
  suite: yup.string(),
  city: yup.string(),
  zipcode: yup.string(),
  lat: yup
    .number()
    .nullable()
    .transform((_, val) => (val === Number(val) ? val : null)),
  lng: yup
    .number()
    .nullable()
    .transform((_, val) => (val === Number(val) ? val : null)),
  website: yup.string(),
  companyName: yup.string(),
  catchPhrase: yup.string(),
  bs: yup.string(),
});
type FormData = yup.InferType<typeof schema>;

type SettingsViewProps = {
  isEditMode?: boolean,
  userToEdit?: User | null
}

const SettingsView = ({isEditMode = false, userToEdit}: SettingsViewProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { setShowToast, setToastMessage } = useContext(
    ToastContext
  ) as ToastContextProps;
  const { setView } = useContext(ViewsContext) as ViewsContextProps;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    const formattedData = {};
    let key: keyof typeof data;
    for (key in data) {
      if (data[key]) {
        // @ts-ignore
        formattedData[key] = data[key];
      }
    }

    let res;
    if (isEditMode && userToEdit) {
      res = await fetch(`https://jsonplaceholder.typicode.com/users/${userToEdit.id}`, {
        method: "PUT",
        body: JSON.stringify(formattedData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
    } else {
      res = await fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify(formattedData),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    }

    if (res.ok) {
      if (isEditMode) {
        setToastMessage("User edited successfully");
      } else {
        setToastMessage("User added successfully");
      }
      setShowToast(true);
      setLoading(false);
      formRef.current!.reset();

      if (isEditMode) {
        setView(Views.USERS)
      }
    }
  };

  useEffect(() => {
      setValue('name', userToEdit && isEditMode ? userToEdit.name : '')
      setValue('username', userToEdit && isEditMode ? userToEdit.username : '')
      setValue('email', userToEdit && isEditMode ? userToEdit.email : '')
      setValue('phone', userToEdit && isEditMode ? userToEdit.phone : '')
      setValue('street', userToEdit && isEditMode ? userToEdit.address.street : '')
      setValue('suite', userToEdit && isEditMode ? userToEdit.address.suite : '')
      setValue('city', userToEdit && isEditMode ? userToEdit.address.city : '')
      setValue('zipcode', userToEdit && isEditMode ? userToEdit.address.zipcode : '')
      setValue('lat', userToEdit && isEditMode ? parseFloat(userToEdit.address.geo.lat) : null)
      setValue('lng', userToEdit && isEditMode ? parseFloat(userToEdit.address.geo.lng) : null)
      setValue('website', userToEdit && isEditMode ? userToEdit.website : '')
      setValue('companyName', userToEdit && isEditMode ? userToEdit.company.name : '')
      setValue('catchPhrase', userToEdit && isEditMode ? userToEdit.company.catchPhrase : '')
      setValue('bs', userToEdit && isEditMode ? userToEdit.company.bs : '')
  }, [isEditMode, userToEdit, setValue])

  return (
    <div
      style={{ width: "min(90%, 40rem)" }}
      className="mx-auto border border-dark border-2 rounded m-5 p-3 shadow-lg bg-secondary"
    >
      <p className="fs-2 text-center">{isEditMode ? 'Edit user' : 'Add new user:'}</p>
      <Form
        className="d-grid gap-2"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        ref={formRef}
      >
        <Form.Group controlId="name">
          <Form.Label>Name*</Form.Label>
          <Form.Control
            {...register("name")}
            isInvalid={errors?.name && true}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.name?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="username">
          <Form.Label>Username*</Form.Label>
          <Form.Control
            {...register("username")}
            isInvalid={errors?.username && true}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.username?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Email*</Form.Label>
          <Form.Control
            type="email"
            {...register("email")}
            isInvalid={errors?.email && true}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.email?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="phone">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="tel" {...register("phone")}></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.phone?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="adress-street">
          <Form.Label>Street</Form.Label>
          <Form.Control {...register("street")}></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.street?.message}
          </Form.Control.Feedback>
        </Form.Group>

        <Row>
          <Form.Group as={Col} controlId="adress-suite">
            <Form.Label>Suite</Form.Label>
            <Form.Control {...register("suite")}></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.suite?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="adress-city">
            <Form.Label>City</Form.Label>
            <Form.Control {...register("city")}></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.city?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="adress-zip">
            <Form.Label>Zip code</Form.Label>
            <Form.Control {...register("zipcode")}></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.zipcode?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="adress-geo-lat">
            <Form.Label>Latitude</Form.Label>
            <Form.Control type="number" {...register("lat")}></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.lat?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="adress-geo-lng">
            <Form.Label>Longitude</Form.Label>
            <Form.Control type="number" {...register("lng")}></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.lng?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Form.Group controlId="website">
          <Form.Label>Website</Form.Label>
          <Form.Control {...register("website")}></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.website?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Row>
          <Form.Group as={Col} controlId="company-name">
            <Form.Label>Company name</Form.Label>
            <Form.Control {...register("companyName")}></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.companyName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="company-catchphrase">
            <Form.Label>Company catch phrase</Form.Label>
            <Form.Control {...register("catchPhrase")}></Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.catchPhrase?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Form.Group as={Col} controlId="company-bs">
          <Form.Label>Business services</Form.Label>
          <Form.Control as="textarea" {...register("bs")}></Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.bs?.message}
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          type="submit"
          disabled={loading}
          className="d-flex justify-content-center"
        >
          {loading ? (
            <span className="d-flex align-items-center gap-1">
              <Spinner size="sm" />
              <span>Adding user...</span>
            </span>
          ) : (
            <span>Submit</span>
          )}
        </Button>
      </Form>
    </div>
  );
};

export default SettingsView;
