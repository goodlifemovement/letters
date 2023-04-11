import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import type { InfoFormValues } from "./InfoForm";
import InfoForm from "./InfoForm";
import LetterForm from "./LetterForm";
import LetterRecipients from "./LetterRecipients";
import type { StyleFormValues } from "./StyleForm";
import StyleForm from "./StyleForm";

const INFO_FORM_VALUES_KEY = "info_form_values";
const STYLE_FORM_VALUES_KEY = "style_form_values";

enum WizardStateEnum {
  INFO_VIEW = 0,
  STYLE_VIEW = 1,
  LETTER_VIEW = 2,
}

function checkFormValues(obj: Record<string, any>): boolean {
  for (const value of Object.values(obj)) {
    if (
      !value ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && Object.keys(value).length === 0)
    ) {
      return false;
    }
  }

  return true;
}

const LetterWizard = function LetterWizard() {
  const [isReady, setIsReady] = useState(false);
  const [currentState, setCurrentState] = useState<WizardStateEnum>(
    WizardStateEnum.INFO_VIEW
  );
  const [latestAllowedState, setLatestAllowedState] = useState<WizardStateEnum>(
    WizardStateEnum.INFO_VIEW
  );
  const [infoValues, setInfoValues] = useState<InfoFormValues>({
    email: "",
    firstName: "",
    lastName: "",
    streetAddress: "",
    zip: "",
  });
  const [styleValues, setStyleValues] = useState<StyleFormValues>({
    experienceOptions: [],
    issueOptions: [],
    toneOptions: "",
  });

  const infoValuesOnNext = useCallback((newInfoValues: InfoFormValues) => {
    setInfoValues(newInfoValues);
    window.sessionStorage.setItem(
      INFO_FORM_VALUES_KEY,
      JSON.stringify(newInfoValues)
    );

    setCurrentState(WizardStateEnum.STYLE_VIEW);
  }, []);

  const styleValuesOnNext = useCallback((newStyleValues: StyleFormValues) => {
    setStyleValues(newStyleValues);
    window.sessionStorage.setItem(
      STYLE_FORM_VALUES_KEY,
      JSON.stringify(newStyleValues)
    );

    setCurrentState(WizardStateEnum.LETTER_VIEW);
  }, []);

  // Initializing the wizard values
  useLayoutEffect(() => {
    try {
      const savedInfoFormValues =
        window.sessionStorage.getItem(INFO_FORM_VALUES_KEY);

      if (savedInfoFormValues) {
        setInfoValues(JSON.parse(savedInfoFormValues) as InfoFormValues);
      }

      const savedStyleFormValues = window.sessionStorage.getItem(
        STYLE_FORM_VALUES_KEY
      );

      if (savedStyleFormValues) {
        setStyleValues(JSON.parse(savedStyleFormValues) as StyleFormValues);
      }
    } catch (error) {
      console.error("Failed to parse existing data.", error);
    }

    // Fill in this portion later
    // const searchParams = new URLSearchParams(window.location.search);
    // const queryStep = searchParams.get("step");

    setIsReady(true);
  }, []);

  useEffect(() => {
    setLatestAllowedState(
      checkFormValues(infoValues)
        ? checkFormValues(styleValues)
          ? WizardStateEnum.LETTER_VIEW
          : WizardStateEnum.STYLE_VIEW
        : WizardStateEnum.INFO_VIEW
    );
  }, [infoValues, styleValues]);

  if (!isReady) {
    return <></>;
  }

  return (
    <>
      {currentState !== WizardStateEnum.INFO_VIEW && (
        <LetterRecipients
          address={`${infoValues.streetAddress} ${infoValues.zip}`}
        />
      )}
      {currentState === WizardStateEnum.INFO_VIEW && (
        <InfoForm values={infoValues} onNext={infoValuesOnNext} />
      )}
      {currentState === WizardStateEnum.STYLE_VIEW && (
        <StyleForm values={styleValues} onNext={styleValuesOnNext} />
      )}
      {currentState === WizardStateEnum.LETTER_VIEW && (
        <LetterForm
          values={{
            infoValues,
            styleValues,
          }}
        />
      )}
      {currentState !== WizardStateEnum.INFO_VIEW && (
        <div className="text-center mt-4">
          <button
            className="underline"
            onClick={() => {
              if (currentState === WizardStateEnum.STYLE_VIEW) {
                setCurrentState(WizardStateEnum.INFO_VIEW);
              } else if (currentState === WizardStateEnum.LETTER_VIEW) {
                setCurrentState(WizardStateEnum.STYLE_VIEW);
              }
            }}
          >
            Previous
          </button>
        </div>
      )}
    </>
  );
};

export default LetterWizard;
