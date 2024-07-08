import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { useCountryQuery } from '@/graphql/generated/schema';
import { useRouter } from 'next/router';
import React from 'react';

const CountryDetail = () => {
  const router = useRouter();
  const getCountryQuery = useCountryQuery({
    variables: {
      code: router.query.code as string,
    },
  });

  if (getCountryQuery.loading) return <p>Chargement....</p>;
  if (getCountryQuery.error) return <p>Une erreur est survenue</p>;

  const country = getCountryQuery.data?.country;

  return (
    <Layout>
      <Card className="h-full flex items-center justify-center py-8">
        <div className="flex flex-col items-center text-center gap-3">
          <img
            src={`https://flagcdn.com/48x36/${country?.code.toLowerCase()}.png`}
            width={48}
            height={36}
            alt={country?.name}
            className="object-cover"
          />
          <span>
            Name : {country?.name} ({country?.code})
          </span>
          <span>Emoji : {country?.emoji}</span>
          <span>Continent : {country?.continent?.name}</span>
        </div>
      </Card>
    </Layout>
  );
};

export default CountryDetail;
