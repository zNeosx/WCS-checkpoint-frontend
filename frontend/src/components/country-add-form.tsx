import {
  CountriesDocument,
  useAddCountryMutation,
  useContinentsQuery,
} from '@/graphql/generated/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Name is required',
    })
    .max(50),
  emoji: z
    .string()
    .min(1, {
      message: 'Emoji is required',
    })
    .max(50),
  code: z
    .string()
    .min(1, {
      message: 'Code is required',
    })
    .max(50),
  continent: z.any(),
});

const CountryAddForm = () => {
  const getContinentsQuery = useContinentsQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      emoji: '',
      code: '',
      continent: {
        id: undefined,
      },
    },
  });

  const [addCountryMutation, addCountryMutationResult] = useAddCountryMutation({
    onCompleted: () => {
      form.reset();
      toast.success('The country has been added', {
        style: {
          color: 'green',
        },
      });
    },
    refetchQueries: [
      {
        query: CountriesDocument,
      },
    ],
    onError: (error) => {
      const [graphQLErrors] = error.graphQLErrors ?? [];
      if (
        graphQLErrors.extensions.validationErrors &&
        (graphQLErrors.extensions.validationErrors as any[]).length > 0
      ) {
        (graphQLErrors.extensions.validationErrors as any[]).forEach(
          (error) => {
            const [property, constraint] = Object.entries(error.constraints)[0];
            form.setError(error.property, {
              message: constraint as string,
            });
          }
        );
      }

      // manage continent value linked to ObjectId typing from backend
      if (graphQLErrors.message.includes('data.continent.id')) {
        form.setError('continent', {
          message: 'Continent is required',
        });
      }

      toast.error('An error is occured', {
        style: {
          color: 'red',
        },
      });
    },
  });
  if (getContinentsQuery.loading) return <p>Chargement....</p>;
  if (getContinentsQuery.error) return <p>Une erreur est survenue</p>;

  function onSubmit(values: z.infer<typeof formSchema>) {
    values.continent = {
      id: Number(values.continent),
    };

    addCountryMutation({
      variables: {
        data: values,
      },
    });
  }

  const continents = getContinentsQuery.data?.continents || [];

  return (
    <Card className="p-6 bg-slate-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid sm:grid-cols-4 gap-3"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="France"
                    {...field}
                    disabled={addCountryMutationResult.loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emoji"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emoji</FormLabel>
                <FormControl>
                  <Input
                    placeholder="🇫🇷"
                    {...field}
                    disabled={addCountryMutationResult.loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="FR"
                    {...field}
                    disabled={addCountryMutationResult.loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="continent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Continent</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a continent" />
                    </SelectTrigger>
                    <SelectContent>
                      {continents.map((continent) => (
                        <SelectItem
                          key={continent.id}
                          value={String(continent.id)}
                        >
                          {continent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="self-end"
            disabled={addCountryMutationResult.loading}
          >
            Add
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default CountryAddForm;
