import { useForm } from "react-hook-form";
import Button from "./Button";

const issueOptions = ["a", "b", "c"];
const experienceOptions = ["negative", "denied"];
const toneOptions = ["angry", "sad", "frustrated"];

export interface StyleFormValues {
  issueOptions: string[];
  experienceOptions: string[];
  toneOptions: string;
}

function StyleForm({
  values,
  onNext,
}: {
  values: StyleFormValues;
  onNext: (values: StyleFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StyleFormValues>({
    defaultValues: values,
  });

  return (
    <form
      className="grid gap-4 font-body text-[#1e2254] text-lg"
      onSubmit={handleSubmit(onNext)}
    >
      <div>
        <p>I care about...</p>
        <div className="grid grid-cols-3 gap-4">
          {issueOptions.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                {...register("issueOptions", { required: true })}
              />
              {option}
            </label>
          ))}
        </div>
        {errors.issueOptions && <p>This field is required</p>}
      </div>
      <div>
        <p>My experiences are...</p>

        <div className="grid grid-cols-3 gap-4 ">
          {experienceOptions.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                value={option}
                {...register("experienceOptions", { required: true })}
              />
              {option}
            </label>
          ))}
        </div>
        {errors.experienceOptions && <p>This field is required</p>}
      </div>

      <div>
        <p>
          I feel <span className="inline-block w-8 border-b border-[#1e2254]" />{" "}
          about this...
        </p>
        <div className="grid grid-cols-3 gap-4">
          {toneOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                value={option}
                {...register("toneOptions", { required: true })}
              />
              {option}
            </label>
          ))}
        </div>
        {errors.toneOptions && <p>This field is required</p>}
      </div>
      <Button type="submit">Generate Letter</Button>
    </form>
  );
}

export default StyleForm;
