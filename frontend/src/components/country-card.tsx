import { Country } from '@/graphql/generated/schema';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface Props {
  country: Country;
}
const CountryCard = ({ country }: Props) => {
  return (
    <Link href={`/country/${country.code}`}>
      <Card>
        <CardHeader>
          <CardTitle>{country.name}</CardTitle>
          <CardDescription>
            {country.code} - {country.emoji}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <img
            src={`https://flagcdn.com/32x24/${country.code.toLowerCase()}.png`}
            width={32}
            height={24}
            alt={country.name}
          />
        </CardContent>
      </Card>
    </Link>
  );
};

export default CountryCard;
