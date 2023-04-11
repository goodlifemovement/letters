import { useEffect, useState } from "react";

const KEY = "AIzaSyAm3rfpnKknLZRI3U-vhvRSIfDKSjc2EPs";

type Representative = {
  readonly name: string;
  readonly title: string;
  readonly photoUrl?: string;
};

const LetterRecipients = function LetterRecipients({
  address,
}: {
  address: string;
}) {
  const [representatives, setRepresentatives] = useState<
    readonly Representative[]
  >([]);

  useEffect(() => {
    if (!address) {
      return;
    }

    (async () => {
      const response = await fetch(
        `https://www.googleapis.com/civicinfo/v2/representatives?key=${KEY}&levels=country&&roles=legislatorUpperBody&roles=legislatorLowerBody&address=${encodeURIComponent(
          address
        )}`
      );
      const data = await response.json();

      const representatives = (data.offices as any[])?.reduce(
        (acc, { name: title, officialIndices }) => {
          const reps = officialIndices.map((index: number) => {
            const { name, photoUrl } = data.officials[index];

            return {
              name: `${title} ${name}`,
              photoUrl,
            };
          });

          return [...acc, ...reps];
        },
        []
      );

      setRepresentatives(representatives);
    })();
  }, [address]);

  return (
    <div className="font-body">
      <p>Writing to:</p>
      {representatives.map(({ name, photoUrl }) => (
        <div key={name}>{name}</div>
      ))}
    </div>
  );
};

export default LetterRecipients;
