// import { Text, View, StyleSheet } from 'react-native';

// export default function HomeScreen() {
//   return (
//     <View style={styles.container}>
//       <Text>Home Screen</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// });

import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

type Pokemon = {
  name: string;
  image: string | null;
};

export default function Index() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");

        if (!res.ok) {
          throw new Error("Failed to fetch Pokémon");
        }

        const data = await res.json();
        const detailedPokemon: Pokemon[] = await Promise.all(
          data.results.map(async (p: { name: string; url: string }) => {
            const response = await fetch(p.url);

            if (!response.ok) {
              throw new Error(`Failed to fetch ${p.name}`);
            }

            const detailedData = await response.json();

            return {
              name: p.name,
              image: detailedData.sprites.front_default,
            };
          }),
        );

        setPokemon(detailedPokemon);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemon();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text>Pokemon Lists</Text>

      {pokemon.map((p) => (
        <Pressable
          key={p.name}
          onPress={() =>
            router.push({
              pathname: "/pokemon/[name]",
              params: { name: p.name },
            } as any)
          }
          style={{
            alignItems: "center",
            padding: 16,
            marginBottom: 12,
            backgroundColor: "#f1f5f9",
            borderRadius: 12,
          }}
        >
         <view style={
         { flex: "column",
          backgroundColor: "#f1f5f9",
          borderRadius: 12,
          padding: 16,
          alignItems: "center",
          justifyContent: "center"
         }
         }>

          <Text>{p.name}</Text>

          <Image
            source={{ uri: p.image ?? undefined }}
            style={{ width: 100, height: 100 }}
          />

         </view>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  image: {
    width: 100,
    height: 100,
  },
  loader: {
    flex: 1,
  },
});
