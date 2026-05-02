import type { Player } from '../types';
import { bankPlayers } from './players-banks';
import { telcoPlayers, energyPlayers, conglomeratePlayers, multinationalPlayers } from './players-industry';
import { govPlayers, parastatalPlayers, insurerPlayers, fintechPlayers, intlOrgPlayers } from './players-gov';

export const players: Player[] = [
  ...bankPlayers,
  ...telcoPlayers,
  ...energyPlayers,
  ...conglomeratePlayers,
  ...multinationalPlayers,
  ...govPlayers,
  ...parastatalPlayers,
  ...insurerPlayers,
  ...fintechPlayers,
  ...intlOrgPlayers,
];
