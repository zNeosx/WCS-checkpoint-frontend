import CountryAddForm from '@/components/country-add-form';
import CountryCard from '@/components/country-card';
import Layout from '@/components/Layout';
import { useCountriesQuery } from '@/graphql/generated/schema';

export default function Home() {
  const getCountriesQuery = useCountriesQuery();

  if (getCountriesQuery.loading) return <p>Chargement....</p>;
  if (getCountriesQuery.error) return <p>Une erreur est survenue</p>;

  const countries = getCountriesQuery.data?.countries || [];
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Wild Countries</h1>

        <CountryAddForm />

        <ul className="grid sm:grid-cols-4 lg:grid-cols-5 gap-4">
          {countries.map((country) => (
            <li key={country.id}>
              <CountryCard country={country} />
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
