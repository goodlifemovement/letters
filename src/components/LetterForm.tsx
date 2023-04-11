import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import letters from "../letters.json";
import Button from "./Button";
import type { InfoFormValues } from "./InfoForm";
import Input from "./Input";
import type { StyleFormValues } from "./StyleForm";

type LetterValues = {
  infoValues: InfoFormValues;
  styleValues: StyleFormValues;
};

export type LetterFormValues = {
  subject: string;
  message: string;
};

type Letter = {
  id: string;
  subject: string;
  message: string;
  tags: string[];
  tone: string;
};

function rankLetters(tone: string, tags: string[]) {
  const rankedMessages = (letters as Letter[]).reduce(
    (acc, letter: Letter) => {
      if (letter.tone === tone) {
        const matched = letter.tags.filter((tag) => tags.includes(tag)).length;

        if (matched > 0) {
          if (!acc[matched]) {
            acc[matched] = { letters: [], matched };
          }

          acc[matched].letters.push(letter);
        }
      }

      return acc;
    },
    {} as {
      [key: number]: {
        letters: Letter[];
        matched: number;
      };
    }
  );

  return Object.values(rankedMessages).sort((a, b) => b.matched - a.matched);
}

function LetterForm({ values }: { values: LetterValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LetterFormValues>();
  const [letter, setLetter] = useState<Letter>();
  const [matches, setMatches] = useState<Letter[]>([]);
  const [remainingLetters, setRemainingLetters] = useState<Letter[]>([]);
  const [pickedLetters, setPickedLetters] = useState<Letter[]>([]);

  const pickLetter = (): void => {
    let tempRemainingLetters = remainingLetters;
    let tempPickedLetters = pickedLetters;

    if (remainingLetters.length === 0) {
      // If all items have been picked, start again by resetting the picked items and remaining items arrays
      tempRemainingLetters = matches;
      tempPickedLetters = [];
    }

    // Pick a random item from the remaining items array
    const pickedLetter =
      tempRemainingLetters[
        Math.floor(Math.random() * tempRemainingLetters.length)
      ];

    // Update the state arrays
    setRemainingLetters(
      tempRemainingLetters.filter(
        (remainingLetter) => remainingLetter.id !== pickedLetter.id
      )
    );
    setPickedLetters([...tempPickedLetters, pickedLetter]);
    setLetter(pickedLetter);
  };

  useEffect(() => {
    if (!values?.styleValues) {
      return;
    }

    const { toneOptions, experienceOptions, issueOptions } = values.styleValues;

    const bestMatches = rankLetters(toneOptions, [
      ...experienceOptions,
      ...issueOptions,
    ])?.[0];

    if (!bestMatches) {
      return;
    }

    setMatches(bestMatches.letters);
  }, [values.styleValues]);

  useEffect(() => {
    if (matches) {
      pickLetter();
    }
  }, [matches]);

  useEffect(() => {
    if (letter) {
      setValue("message", letter.message);
      setValue("subject", letter.subject);

      console.dir(values.styleValues);
      console.dir(letter);
    }
  }, [letter]);

  const onSubmit = (data: LetterFormValues) => console.log(data);

  if (!letter) {
    return;
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>
          Subject
          <Input
            {...register("subject", {
              required: true,
            })}
            type="text"
            placeholder="Subject here"
            aria-label="Subject"
            className="w-full"
          />
        </label>
        {errors.subject?.type === "required" && (
          <span>This field is required</span>
        )}
      </div>
      <div>
        <textarea
          {...register("message", { required: true })}
          placeholder="Message"
          aria-label="Message"
          className="w-full p-6 rounded-3xl h-40"
        />
        {errors.message && <span>This field is required</span>}
      </div>

      {/* <Button type="submit">Send letter!</Button> */}
      {matches.length > 1 && (
        <Button type="button" onClick={pickLetter}>
          Regenerate letter
        </Button>
      )}
    </form>
  );
}

export default LetterForm;
