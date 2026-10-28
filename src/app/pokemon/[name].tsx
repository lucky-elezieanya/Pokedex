import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";

type PokemonDetails = {
  name: string;
  image: string | null;
  height: number;
  weight: number;
  types: string[];
};

export default function PokemonDetailsScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();

  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);

        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name}`,
        );

        if (!response.ok) {
          throw new Error("Could not fetch Pokémon details");
        }

        const data = await response.json();

        setPokemon({
          name: data.name,
          image: data.sprites.front_default,
          height: data.height,
          weight: data.weight,
          types: data.types.map(
            (item: { type: { name: string } }) => item.type.name,
          ),
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    if (name) {
      fetchDetails();
    }
  }, [name]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!pokemon) {
    return <Text>Could not load Pokémon details.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {pokemon.image && (
        <Image source={{ uri: pokemon.image }} style={styles.image} />
      )}

      <Text style={styles.title}>{pokemon.name.toUpperCase()}</Text>

      <Text>Height: {pokemon.height / 10} m</Text>
      <Text>Weight: {pokemon.weight / 10} kg</Text>
      <Text>Types: {pokemon.types.join(", ")}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loader: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
