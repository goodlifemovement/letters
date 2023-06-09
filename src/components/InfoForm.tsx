import { useForm } from "react-hook-form";
import Input from "./Input";
import Button from "./Button";

export type InfoFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  zip: string;
};

function InfoForm({
  values,
  onNext,
}: {
  values: InfoFormValues;
  onNext: (values: InfoFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InfoFormValues>({
    defaultValues: values,
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onNext)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            {...register("firstName", { required: true })}
            type="text"
            placeholder="First Name"
            aria-label="First Name"
            className="w-full"
          />
          {errors.firstName && <span>This field is required</span>}
        </div>
        <div>
          <Input
            {...register("lastName", { required: true })}
            type="text"
            placeholder="Last Name"
            aria-label="Last Name"
            className="w-full"
          />
          {errors.lastName && <span>This field is required</span>}
        </div>
      </div>
      <div>
        <Input
          {...register("email", {
            required: true,
            pattern: /^\S+@\S+$/i,
          })}
          type="email"
          placeholder="Email Address"
          aria-label="Email Address"
          className="w-full"
        />
        {errors.email?.type === "required" && (
          <span>This field is required</span>
        )}
        {errors.email?.type === "pattern" && (
          <span>Please enter a valid email address</span>
        )}
      </div>
      <div>
        <Input
          {...register("streetAddress", { required: true })}
          type="text"
          placeholder="Street Address"
          aria-label="Street Address"
          className="w-full"
        />
        {errors.streetAddress && <span>This field is required</span>}
      </div>
      <div>
        <Input
          {...register("zip", {
            required: true,
            pattern: /^\d{5}(?:[-\s]\d{4})?$/,
          })}
          type="text"
          placeholder="Zip"
          aria-label="Zip"
          className="w-full"
        />
        {errors.zip?.type === "required" && <span>This field is required</span>}
        {errors.zip?.type === "pattern" && (
          <span>Please enter a valid zip code</span>
        )}
      </div>

      <Button type="submit">Start Writing</Button>
    </form>
  );
}

export default InfoForm;
