'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/motion';

interface NameEntry {
  rank: number;
  name: string;
  slug: string;
}

interface YearData {
  girls: NameEntry[];
  boys: NameEntry[];
}

interface Country {
  code: string;
  name: string;
  years: Record<number, YearData>;
}

const countries: Country[] = [
  {
    code: 'DE',
    name: 'Deutschland',
    years: {
      2026: {
        girls: [
          { rank: 1, name: 'Emilia', slug: 'emilia' },
          { rank: 2, name: 'Sophia / Sofia', slug: 'sophia' },
          { rank: 3, name: 'Emma', slug: 'emma' },
          { rank: 4, name: 'Mila', slug: 'mila' },
          { rank: 5, name: 'Mia', slug: 'mia' },
          { rank: 6, name: 'Ida', slug: 'ida' },
          { rank: 7, name: 'Lia', slug: 'lia' },
          { rank: 8, name: 'Hannah', slug: 'hannah' },
          { rank: 9, name: 'Leni', slug: 'leni' },
          { rank: 10, name: 'Ella', slug: 'ella' },
        ],
        boys: [
          { rank: 1, name: 'Noah', slug: 'noah' },
          { rank: 2, name: 'Theo', slug: 'theo' },
          { rank: 3, name: 'Matteo', slug: 'matteo' },
          { rank: 4, name: 'Leo', slug: 'leo' },
          { rank: 5, name: 'Emil', slug: 'emil' },
          { rank: 6, name: 'Liam', slug: 'liam' },
          { rank: 7, name: 'Luca', slug: 'luca' },
          { rank: 8, name: 'Elias', slug: 'elias' },
          { rank: 9, name: 'Henry', slug: 'henry' },
          { rank: 10, name: 'Leon', slug: 'leon' },
        ],
      },
      2025: {
        girls: [
          { rank: 1, name: 'Sophia', slug: 'sophia' },
          { rank: 2, name: 'Emma', slug: 'emma' },
          { rank: 3, name: 'Emilia', slug: 'emilia' },
          { rank: 4, name: 'Hannah', slug: 'hannah' },
          { rank: 5, name: 'Lina', slug: 'lina' },
          { rank: 6, name: 'Mia', slug: 'mia' },
          { rank: 7, name: 'Clara', slug: 'clara' },
          { rank: 8, name: 'Ella', slug: 'ella' },
          { rank: 9, name: 'Mila', slug: 'mila' },
          { rank: 10, name: 'Lia', slug: 'lia' },
        ],
        boys: [
          { rank: 1, name: 'Noah', slug: 'noah' },
          { rank: 2, name: 'Matteo', slug: 'matteo' },
          { rank: 3, name: 'Elias', slug: 'elias' },
          { rank: 4, name: 'Theo', slug: 'theo' },
          { rank: 5, name: 'Leo', slug: 'leo' },
          { rank: 6, name: 'Luca', slug: 'luca' },
          { rank: 7, name: 'Paul', slug: 'paul' },
          { rank: 8, name: 'Leon', slug: 'leon' },
          { rank: 9, name: 'Emil', slug: 'emil' },
          { rank: 10, name: 'Felix', slug: 'felix' },
        ],
      },
      2023: {
        girls: [
          { rank: 1, name: 'Sophia / Sofia', slug: 'sophia' },
          { rank: 2, name: 'Emilia', slug: 'emilia' },
          { rank: 3, name: 'Emma', slug: 'emma' },
          { rank: 4, name: 'Mia', slug: 'mia' },
          { rank: 5, name: 'Hannah / Hanna', slug: 'hannah' },
          { rank: 6, name: 'Mila', slug: 'mila' },
          { rank: 7, name: 'Lina', slug: 'lina' },
          { rank: 8, name: 'Ella', slug: 'ella' },
          { rank: 9, name: 'Lia', slug: 'lia' },
          { rank: 10, name: 'Clara / Klara', slug: 'clara' },
        ],
        boys: [
          { rank: 1, name: 'Noah', slug: 'noah' },
          { rank: 2, name: 'Matteo / Matheo', slug: 'matteo' },
          { rank: 3, name: 'Leon', slug: 'leon' },
          { rank: 4, name: 'Paul', slug: 'paul' },
          { rank: 5, name: 'Emil', slug: 'emil' },
          { rank: 6, name: 'Luca / Luka', slug: 'luca' },
          { rank: 7, name: 'Elias', slug: 'elias' },
          { rank: 8, name: 'Louis / Luis', slug: 'louis' },
          { rank: 9, name: 'Liam', slug: 'liam' },
          { rank: 10, name: 'Lucas / Lukas', slug: 'lucas' },
        ],
      },
    },
  },
  {
    code: 'IT',
    name: 'Italien',
    years: {
      2024: {
        girls: [
          { rank: 1, name: 'Sofia', slug: 'sofia' },
          { rank: 2, name: 'Aurora', slug: 'aurora' },
          { rank: 3, name: 'Ginevra', slug: 'ginevra' },
          { rank: 4, name: 'Vittoria', slug: 'vittoria' },
          { rank: 5, name: 'Giulia', slug: 'giulia' },
          { rank: 6, name: 'Beatrice', slug: 'beatrice' },
          { rank: 7, name: 'Ludovica', slug: 'ludovica' },
          { rank: 8, name: 'Alice', slug: 'alice' },
          { rank: 9, name: 'Emma', slug: 'emma' },
          { rank: 10, name: 'Matilde', slug: 'matilde' },
        ],
        boys: [
          { rank: 1, name: 'Leonardo', slug: 'leonardo' },
          { rank: 2, name: 'Edoardo', slug: 'edoardo' },
          { rank: 3, name: 'Tommaso', slug: 'tommaso' },
          { rank: 4, name: 'Mattia', slug: 'mattia' },
          { rank: 5, name: 'Alessandro', slug: 'alessandro' },
          { rank: 6, name: 'Francesco', slug: 'francesco' },
          { rank: 7, name: 'Lorenzo', slug: 'lorenzo' },
          { rank: 8, name: 'Gabriele', slug: 'gabriele' },
          { rank: 9, name: 'Riccardo', slug: 'riccardo' },
          { rank: 10, name: 'Andrea', slug: 'andrea' },
        ],
      },
      2023: {
        girls: [
          { rank: 1, name: 'Sofia', slug: 'sofia' },
          { rank: 2, name: 'Aurora', slug: 'aurora' },
          { rank: 3, name: 'Ginevra', slug: 'ginevra' },
          { rank: 4, name: 'Vittoria', slug: 'vittoria' },
          { rank: 5, name: 'Giulia', slug: 'giulia' },
          { rank: 6, name: 'Beatrice', slug: 'beatrice' },
          { rank: 7, name: 'Ludovica', slug: 'ludovica' },
          { rank: 8, name: 'Alice', slug: 'alice' },
          { rank: 9, name: 'Emma', slug: 'emma' },
          { rank: 10, name: 'Matilde', slug: 'matilde' },
        ],
        boys: [
          { rank: 1, name: 'Leonardo', slug: 'leonardo' },
          { rank: 2, name: 'Edoardo', slug: 'edoardo' },
          { rank: 3, name: 'Tommaso', slug: 'tommaso' },
          { rank: 4, name: 'Francesco', slug: 'francesco' },
          { rank: 5, name: 'Alessandro', slug: 'alessandro' },
          { rank: 6, name: 'Mattia', slug: 'mattia' },
          { rank: 7, name: 'Lorenzo', slug: 'lorenzo' },
          { rank: 8, name: 'Gabriele', slug: 'gabriele' },
          { rank: 9, name: 'Riccardo', slug: 'riccardo' },
          { rank: 10, name: 'Andrea', slug: 'andrea' },
        ],
      },
    },
  },
  {
    code: 'PL',
    name: 'Polen',
    years: {
      2025: {
        girls: [
          { rank: 1, name: 'Zofia', slug: 'zofia' },
          { rank: 2, name: 'Zuzanna', slug: 'zuzanna' },
          { rank: 3, name: 'Maja', slug: 'maja' },
          { rank: 4, name: 'Laura', slug: 'laura' },
          { rank: 5, name: 'Hanna', slug: 'hanna' },
          { rank: 6, name: 'Julia', slug: 'julia' },
          { rank: 7, name: 'Oliwia', slug: 'oliwia' },
          { rank: 8, name: 'Pola', slug: 'pola' },
          { rank: 9, name: 'Alicja', slug: 'alicja' },
          { rank: 10, name: 'Emilia', slug: 'emilia' },
        ],
        boys: [
          { rank: 1, name: 'Nikodem', slug: 'nikodem' },
          { rank: 2, name: 'Antoni', slug: 'antoni' },
          { rank: 3, name: 'Leon', slug: 'leon' },
          { rank: 4, name: 'Jan', slug: 'jan' },
          { rank: 5, name: 'Aleksander', slug: 'aleksander' },
          { rank: 6, name: 'Franciszek', slug: 'franciszek' },
          { rank: 7, name: 'Ignacy', slug: 'ignacy' },
          { rank: 8, name: 'Stanisław', slug: 'stanislaw' },
          { rank: 9, name: 'Jakub', slug: 'jakub' },
          { rank: 10, name: 'Mikołaj', slug: 'mikolaj' },
        ],
      },
      2024: {
        girls: [
          { rank: 1, name: 'Maja', slug: 'maja' },
          { rank: 2, name: 'Zofia', slug: 'zofia' },
          { rank: 3, name: 'Zuzanna', slug: 'zuzanna' },
          { rank: 4, name: 'Laura', slug: 'laura' },
          { rank: 5, name: 'Hanna', slug: 'hanna' },
          { rank: 6, name: 'Julia', slug: 'julia' },
          { rank: 7, name: 'Oliwia', slug: 'oliwia' },
          { rank: 8, name: 'Pola', slug: 'pola' },
          { rank: 9, name: 'Alicja', slug: 'alicja' },
          { rank: 10, name: 'Maria', slug: 'maria' },
        ],
        boys: [
          { rank: 1, name: 'Nikodem', slug: 'nikodem' },
          { rank: 2, name: 'Antoni', slug: 'antoni' },
          { rank: 3, name: 'Jan', slug: 'jan' },
          { rank: 4, name: 'Aleksander', slug: 'aleksander' },
          { rank: 5, name: 'Leon', slug: 'leon' },
          { rank: 6, name: 'Franciszek', slug: 'franciszek' },
          { rank: 7, name: 'Ignacy', slug: 'ignacy' },
          { rank: 8, name: 'Jakub', slug: 'jakub' },
          { rank: 9, name: 'Stanisław', slug: 'stanislaw' },
          { rank: 10, name: 'Mikołaj', slug: 'mikolaj' },
        ],
      },
      2023: {
        girls: [
          { rank: 1, name: 'Zofia', slug: 'zofia' },
          { rank: 2, name: 'Zuzanna', slug: 'zuzanna' },
          { rank: 3, name: 'Laura', slug: 'laura' },
          { rank: 4, name: 'Hanna', slug: 'hanna' },
          { rank: 5, name: 'Maja', slug: 'maja' },
          { rank: 6, name: 'Julia', slug: 'julia' },
          { rank: 7, name: 'Oliwia', slug: 'oliwia' },
          { rank: 8, name: 'Pola', slug: 'pola' },
          { rank: 9, name: 'Alicja', slug: 'alicja' },
          { rank: 10, name: 'Maria', slug: 'maria' },
        ],
        boys: [
          { rank: 1, name: 'Nikodem', slug: 'nikodem' },
          { rank: 2, name: 'Antoni', slug: 'antoni' },
          { rank: 3, name: 'Jan', slug: 'jan' },
          { rank: 4, name: 'Aleksander', slug: 'aleksander' },
          { rank: 5, name: 'Franciszek', slug: 'franciszek' },
          { rank: 6, name: 'Leon', slug: 'leon' },
          { rank: 7, name: 'Jakub', slug: 'jakub' },
          { rank: 8, name: 'Ignacy', slug: 'ignacy' },
          { rank: 9, name: 'Mikołaj', slug: 'mikolaj' },
          { rank: 10, name: 'Stanisław', slug: 'stanislaw' },
        ],
      },
    },
  },
  {
    code: 'FR',
    name: 'Frankreich',
    years: {
      2024: {
        girls: [
          { rank: 1, name: 'Jade', slug: 'jade' },
          { rank: 2, name: 'Louise', slug: 'louise' },
          { rank: 3, name: 'Alba', slug: 'alba' },
          { rank: 4, name: 'Ambre', slug: 'ambre' },
          { rank: 5, name: 'Alice', slug: 'alice' },
          { rank: 6, name: 'Emma', slug: 'emma' },
          { rank: 7, name: 'Julia', slug: 'julia' },
          { rank: 8, name: 'Léa', slug: 'lea' },
          { rank: 9, name: 'Mia', slug: 'mia' },
          { rank: 10, name: 'Rose', slug: 'rose' },
        ],
        boys: [
          { rank: 1, name: 'Gabriel', slug: 'gabriel' },
          { rank: 2, name: 'Léo', slug: 'leo' },
          { rank: 3, name: 'Raphaël', slug: 'raphael' },
          { rank: 4, name: 'Arthur', slug: 'arthur' },
          { rank: 5, name: 'Louis', slug: 'louis' },
          { rank: 6, name: 'Maël', slug: 'mael' },
          { rank: 7, name: 'Jules', slug: 'jules' },
          { rank: 8, name: 'Adam', slug: 'adam' },
          { rank: 9, name: 'Noah', slug: 'noah' },
          { rank: 10, name: 'Liam', slug: 'liam' },
        ],
      },
      2023: {
        girls: [
          { rank: 1, name: 'Jade', slug: 'jade' },
          { rank: 2, name: 'Louise', slug: 'louise' },
          { rank: 3, name: 'Emma', slug: 'emma' },
          { rank: 4, name: 'Alba', slug: 'alba' },
          { rank: 5, name: 'Alice', slug: 'alice' },
          { rank: 6, name: 'Ambre', slug: 'ambre' },
          { rank: 7, name: 'Julia', slug: 'julia' },
          { rank: 8, name: 'Mia', slug: 'mia' },
          { rank: 9, name: 'Léa', slug: 'lea' },
          { rank: 10, name: 'Anna', slug: 'anna' },
        ],
        boys: [
          { rank: 1, name: 'Gabriel', slug: 'gabriel' },
          { rank: 2, name: 'Léo', slug: 'leo' },
          { rank: 3, name: 'Raphaël', slug: 'raphael' },
          { rank: 4, name: 'Louis', slug: 'louis' },
          { rank: 5, name: 'Arthur', slug: 'arthur' },
          { rank: 6, name: 'Jules', slug: 'jules' },
          { rank: 7, name: 'Adam', slug: 'adam' },
          { rank: 8, name: 'Maël', slug: 'mael' },
          { rank: 9, name: 'Sacha', slug: 'sacha' },
          { rank: 10, name: 'Noah', slug: 'noah' },
        ],
      },
    },
  },
  {
    code: 'ES',
    name: 'Spanien',
    years: {
      2024: {
        girls: [
          { rank: 1, name: 'Lucía', slug: 'lucia' },
          { rank: 2, name: 'Sofía', slug: 'sofia' },
          { rank: 3, name: 'Martina', slug: 'martina' },
          { rank: 4, name: 'María', slug: 'maria' },
          { rank: 5, name: 'Julia', slug: 'julia' },
          { rank: 6, name: 'Paula', slug: 'paula' },
          { rank: 7, name: 'Vega', slug: 'vega' },
          { rank: 8, name: 'Valeria', slug: 'valeria' },
          { rank: 9, name: 'Emma', slug: 'emma' },
          { rank: 10, name: 'Daniela', slug: 'daniela' },
        ],
        boys: [
          { rank: 1, name: 'Hugo', slug: 'hugo' },
          { rank: 2, name: 'Martín', slug: 'martin' },
          { rank: 3, name: 'Lucas', slug: 'lucas' },
          { rank: 4, name: 'Mateo', slug: 'mateo' },
          { rank: 5, name: 'Leo', slug: 'leo' },
          { rank: 6, name: 'Daniel', slug: 'daniel' },
          { rank: 7, name: 'Enzo', slug: 'enzo' },
          { rank: 8, name: 'Alejandro', slug: 'alejandro' },
          { rank: 9, name: 'Pablo', slug: 'pablo' },
          { rank: 10, name: 'Marco', slug: 'marco' },
        ],
      },
    },
  },
  {
    code: 'GB',
    name: 'Vereinigtes Königreich',
    years: {
      2024: {
        girls: [
          { rank: 1, name: 'Olivia', slug: 'olivia' },
          { rank: 2, name: 'Amelia', slug: 'amelia' },
          { rank: 3, name: 'Isla', slug: 'isla' },
          { rank: 4, name: 'Ivy', slug: 'ivy' },
          { rank: 5, name: 'Florence', slug: 'florence' },
          { rank: 6, name: 'Lily', slug: 'lily' },
          { rank: 7, name: 'Freya', slug: 'freya' },
          { rank: 8, name: 'Willow', slug: 'willow' },
          { rank: 9, name: 'Isabella', slug: 'isabella' },
          { rank: 10, name: 'Ava', slug: 'ava' },
        ],
        boys: [
          { rank: 1, name: 'Muhammad', slug: 'muhammad' },
          { rank: 2, name: 'Noah', slug: 'noah' },
          { rank: 3, name: 'Oliver', slug: 'oliver' },
          { rank: 4, name: 'Arthur', slug: 'arthur' },
          { rank: 5, name: 'George', slug: 'george' },
          { rank: 6, name: 'Leo', slug: 'leo' },
          { rank: 7, name: 'Theodore', slug: 'theodore' },
          { rank: 8, name: 'Oscar', slug: 'oscar' },
          { rank: 9, name: 'Henry', slug: 'henry' },
          { rank: 10, name: 'Freddie', slug: 'freddie' },
        ],
      },
    },
  },
  {
    code: 'SE',
    name: 'Schweden',
    years: {
      2024: {
        girls: [
          { rank: 1, name: 'Alice', slug: 'alice' },
          { rank: 2, name: 'Vera', slug: 'vera' },
          { rank: 3, name: 'Astrid', slug: 'astrid' },
          { rank: 4, name: 'Freja', slug: 'freja' },
          { rank: 5, name: 'Maja', slug: 'maja' },
          { rank: 6, name: 'Elsa', slug: 'elsa' },
          { rank: 7, name: 'Ella', slug: 'ella' },
          { rank: 8, name: 'Olivia', slug: 'olivia' },
          { rank: 9, name: 'Wilma', slug: 'wilma' },
          { rank: 10, name: 'Ines', slug: 'ines' },
        ],
        boys: [
          { rank: 1, name: 'William', slug: 'william' },
          { rank: 2, name: 'Noah', slug: 'noah' },
          { rank: 3, name: 'Hugo', slug: 'hugo' },
          { rank: 4, name: 'Liam', slug: 'liam' },
          { rank: 5, name: 'Oscar', slug: 'oscar' },
          { rank: 6, name: 'Elias', slug: 'elias' },
          { rank: 7, name: 'Leo', slug: 'leo' },
          { rank: 8, name: 'Axel', slug: 'axel' },
          { rank: 9, name: 'Melvin', slug: 'melvin' },
          { rank: 10, name: 'Oliver', slug: 'oliver' },
        ],
      },
    },
  },
  {
    code: 'NL',
    name: 'Niederlande',
    years: {
      2024: {
        girls: [
          { rank: 1, name: 'Luna', slug: 'luna' },
          { rank: 2, name: 'Sophie', slug: 'sophie' },
          { rank: 3, name: 'Julia', slug: 'julia' },
          { rank: 4, name: 'Mila', slug: 'mila' },
          { rank: 5, name: 'Emma', slug: 'emma' },
          { rank: 6, name: 'Zoë', slug: 'zoe' },
          { rank: 7, name: 'Noor', slug: 'noor' },
          { rank: 8, name: 'Olivia', slug: 'olivia' },
          { rank: 9, name: 'Saar', slug: 'saar' },
          { rank: 10, name: 'Evi', slug: 'evi' },
        ],
        boys: [
          { rank: 1, name: 'Noah', slug: 'noah' },
          { rank: 2, name: 'Sem', slug: 'sem' },
          { rank: 3, name: 'Levi', slug: 'levi' },
          { rank: 4, name: 'Luca', slug: 'luca' },
          { rank: 5, name: 'James', slug: 'james' },
          { rank: 6, name: 'Milan', slug: 'milan' },
          { rank: 7, name: 'Finn', slug: 'finn' },
          { rank: 8, name: 'Liam', slug: 'liam' },
          { rank: 9, name: 'Adam', slug: 'adam' },
          { rank: 10, name: 'Daan', slug: 'daan' },
        ],
      },
    },
  },
  {
    code: 'US',
    name: 'USA',
    years: {
      2025: {
        girls: [
          { rank: 1, name: 'Olivia', slug: 'olivia' },
          { rank: 2, name: 'Charlotte', slug: 'charlotte' },
          { rank: 3, name: 'Emma', slug: 'emma' },
          { rank: 4, name: 'Amelia', slug: 'amelia' },
          { rank: 5, name: 'Sophia', slug: 'sophia' },
          { rank: 6, name: 'Mia', slug: 'mia' },
          { rank: 7, name: 'Isabella', slug: 'isabella' },
          { rank: 8, name: 'Evelyn', slug: 'evelyn' },
          { rank: 9, name: 'Sofia', slug: 'sofia' },
          { rank: 10, name: 'Eliana', slug: 'eliana' },
        ],
        boys: [
          { rank: 1, name: 'Liam', slug: 'liam' },
          { rank: 2, name: 'Noah', slug: 'noah' },
          { rank: 3, name: 'Oliver', slug: 'oliver' },
          { rank: 4, name: 'Theodore', slug: 'theodore' },
          { rank: 5, name: 'Henry', slug: 'henry' },
          { rank: 6, name: 'James', slug: 'james' },
          { rank: 7, name: 'Elijah', slug: 'elijah' },
          { rank: 8, name: 'Mateo', slug: 'mateo' },
          { rank: 9, name: 'William', slug: 'william' },
          { rank: 10, name: 'Lucas', slug: 'lucas' },
        ],
      },
      2024: {
        girls: [
          { rank: 1, name: 'Olivia', slug: 'olivia' },
          { rank: 2, name: 'Emma', slug: 'emma' },
          { rank: 3, name: 'Amelia', slug: 'amelia' },
          { rank: 4, name: 'Charlotte', slug: 'charlotte' },
          { rank: 5, name: 'Mia', slug: 'mia' },
          { rank: 6, name: 'Sophia', slug: 'sophia' },
          { rank: 7, name: 'Isabella', slug: 'isabella' },
          { rank: 8, name: 'Evelyn', slug: 'evelyn' },
          { rank: 9, name: 'Ava', slug: 'ava' },
          { rank: 10, name: 'Sofia', slug: 'sofia' },
        ],
        boys: [
          { rank: 1, name: 'Liam', slug: 'liam' },
          { rank: 2, name: 'Noah', slug: 'noah' },
          { rank: 3, name: 'Oliver', slug: 'oliver' },
          { rank: 4, name: 'Theodore', slug: 'theodore' },
          { rank: 5, name: 'James', slug: 'james' },
          { rank: 6, name: 'Henry', slug: 'henry' },
          { rank: 7, name: 'Mateo', slug: 'mateo' },
          { rank: 8, name: 'Elijah', slug: 'elijah' },
          { rank: 9, name: 'Lucas', slug: 'lucas' },
          { rank: 10, name: 'William', slug: 'william' },
        ],
      },
      2023: {
        girls: [
          { rank: 1, name: 'Olivia', slug: 'olivia' },
          { rank: 2, name: 'Emma', slug: 'emma' },
          { rank: 3, name: 'Charlotte', slug: 'charlotte' },
          { rank: 4, name: 'Amelia', slug: 'amelia' },
          { rank: 5, name: 'Sophia', slug: 'sophia' },
          { rank: 6, name: 'Mia', slug: 'mia' },
          { rank: 7, name: 'Isabella', slug: 'isabella' },
          { rank: 8, name: 'Ava', slug: 'ava' },
          { rank: 9, name: 'Evelyn', slug: 'evelyn' },
          { rank: 10, name: 'Luna', slug: 'luna' },
        ],
        boys: [
          { rank: 1, name: 'Liam', slug: 'liam' },
          { rank: 2, name: 'Noah', slug: 'noah' },
          { rank: 3, name: 'Oliver', slug: 'oliver' },
          { rank: 4, name: 'James', slug: 'james' },
          { rank: 5, name: 'Elijah', slug: 'elijah' },
          { rank: 6, name: 'William', slug: 'william' },
          { rank: 7, name: 'Henry', slug: 'henry' },
          { rank: 8, name: 'Lucas', slug: 'lucas' },
          { rank: 9, name: 'Theodore', slug: 'theodore' },
          { rank: 10, name: 'Mateo', slug: 'mateo' },
        ],
      },
    },
  },
];

function RankBadge({ rank }: { rank: number }) {
  const isTop3 = rank <= 3;
  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 ${
        isTop3 ? 'bg-gold/15 text-gold' : 'bg-panel text-fade'
      }`}
    >
      {rank}
    </span>
  );
}

export default function BeliebteNamenWeltweitPage() {
  const [selectedCountry, setSelectedCountry] = useState('DE');
  const country = countries.find((c) => c.code === selectedCountry)!;
  const availableYears = Object.keys(country.years)
    .map(Number)
    .sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState(availableYears[0]);

  const yearData = country.years[selectedYear];

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    const c = countries.find((cc) => cc.code === code)!;
    const years = Object.keys(c.years)
      .map(Number)
      .sort((a, b) => b - a);
    setSelectedYear(years[0]);
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-blue-deep transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Zurück zur Startseite
        </Link>
      </div>

      <motion.header
        className="mb-10"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <p className="kicker mb-3">Weltweit</p>
        <h1 className="font-editorial text-[clamp(2rem,5vw,3rem)] leading-tight text-ink">
          Die 10 beliebtesten Babynamen
        </h1>
        <p className="mt-3 text-ink-soft text-[0.95rem] leading-relaxed max-w-xl">
          Eine Übersicht über die zehn beliebtesten Mädchennamen und Jungennamen
          in verschiedenen Ländern und Jahren. Klicke auf einen Namen, um seinen
          Steckbrief mit Herkunft und Bedeutung zu sehen.
        </p>
      </motion.header>

      {/* Country tabs */}
      <motion.div
        className="flex flex-wrap gap-2 mb-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        {countries.map((c) => (
          <button
            key={c.code}
            onClick={() => handleCountryChange(c.code)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCountry === c.code
                ? 'bg-blue text-white shadow-sm'
                : 'bg-surface text-ink-soft border border-line hover:border-blue/40 hover:text-ink'
            }`}
          >
            {c.name}
          </button>
        ))}
      </motion.div>

      {/* Year tabs */}
      <motion.div
        className="flex gap-2 mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.15 }}
      >
        {availableYears.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedYear === year
                ? 'bg-ink text-paper'
                : 'bg-surface text-ink-soft border border-line hover:border-ink/30 hover:text-ink'
            }`}
          >
            {year}
          </button>
        ))}
      </motion.div>

      {/* Tables */}
      {yearData && (
        <motion.div
          key={`${selectedCountry}-${selectedYear}`}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Girls */}
          <motion.section variants={fadeUp}>
            <div className="bg-surface rounded-xl border border-line overflow-hidden">
              <div className="px-5 py-3.5 border-b border-line bg-blue-pale/50">
                <h2 className="text-sm font-semibold text-ink">Mädchennamen</h2>
              </div>
              <ul className="divide-y divide-line/60">
                {yearData.girls.map((entry) => (
                  <li
                    key={entry.rank}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-panel/50 transition-colors"
                  >
                    <RankBadge rank={entry.rank} />
                    <Link
                      href={`/name/${entry.slug}`}
                      className="text-[0.95rem] text-ink font-medium hover:text-blue-deep hover:underline underline-offset-4 transition-colors"
                    >
                      {entry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Boys */}
          <motion.section variants={fadeUp}>
            <div className="bg-surface rounded-xl border border-line overflow-hidden">
              <div className="px-5 py-3.5 border-b border-line bg-blue-pale/50">
                <h2 className="text-sm font-semibold text-ink">Jungennamen</h2>
              </div>
              <ul className="divide-y divide-line/60">
                {yearData.boys.map((entry) => (
                  <li
                    key={entry.rank}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-panel/50 transition-colors"
                  >
                    <RankBadge rank={entry.rank} />
                    <Link
                      href={`/name/${entry.slug}`}
                      className="text-[0.95rem] text-ink font-medium hover:text-blue-deep hover:underline underline-offset-4 transition-colors"
                    >
                      {entry.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        </motion.div>
      )}

      {/* Sources */}
      <motion.div
        className="mt-12 pt-6 border-t border-line"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <p className="text-xs text-fade leading-relaxed">
          <strong className="text-ink-soft">Quellen:</strong>{' '}
          Deutschland – GfdS / schmatzepuffer.de / echtemamas.de;
          Italien – ISTAT;
          Polen – Ministerstwo Cyfryzacji;
          USA – Social Security Administration (SSA);
          Frankreich – INSEE;
          Spanien – INE;
          Vereinigtes Königreich – ONS (England &amp; Wales);
          Schweden – Statistiska centralbyrån (SCB);
          Niederlande – Sociale Verzekeringsbank (SVB).
        </p>
      </motion.div>
    </article>
  );
}