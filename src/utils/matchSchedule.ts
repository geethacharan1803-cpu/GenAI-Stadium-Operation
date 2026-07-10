// ============================================================
// FIFA World Cup 2026 — Full Match Schedule Data
// Spans all 16 stadiums across USA, Mexico, and Canada.
// ============================================================

import { MatchInfo } from '../types';

export const MATCH_SCHEDULE_DB: MatchInfo[] = [
  // USA Venues
  {
    id: 'm-1',
    homeTeam: 'USA',
    awayTeam: 'Brazil',
    kickoffTime: '2026-06-12T19:00:00-04:00',
    venue: 'MetLife Stadium',
    stage: 'Group Stage',
    matchDay: 'Matchday 1',
    homeFlag: '🇺🇸',
    awayFlag: '🇧🇷',
    group: 'Group A'
  },
  {
    id: 'm-2',
    homeTeam: 'Spain',
    awayTeam: 'Japan',
    kickoffTime: '2026-06-13T18:00:00-05:00',
    venue: 'AT&T Stadium',
    stage: 'Group Stage',
    matchDay: 'Matchday 2',
    homeFlag: '🇪🇸',
    awayFlag: '🇯🇵',
    group: 'Group B'
  },
  {
    id: 'm-3',
    homeTeam: 'France',
    awayTeam: 'Australia',
    kickoffTime: '2026-06-14T17:00:00-07:00',
    venue: 'SoFi Stadium',
    stage: 'Group Stage',
    matchDay: 'Matchday 3',
    homeFlag: '🇫🇷',
    awayFlag: '🇦🇺',
    group: 'Group C'
  },
  {
    id: 'm-4',
    homeTeam: 'USA',
    awayTeam: 'England',
    kickoffTime: '2026-06-18T20:00:00-04:00',
    venue: 'MetLife Stadium',
    stage: 'Group Stage',
    matchDay: 'Matchday 7',
    homeFlag: '🇺🇸',
    awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    group: 'Group A'
  },
  // Mexico Venues
  {
    id: 'm-5',
    homeTeam: 'Mexico',
    awayTeam: 'Germany',
    kickoffTime: '2026-06-11T20:00:00-06:00',
    venue: 'Estadio Azteca',
    stage: 'Opening Match (Group A)',
    matchDay: 'Matchday 1',
    homeFlag: '🇲🇽',
    awayFlag: '🇩🇪',
    group: 'Group A'
  },
  {
    id: 'm-6',
    homeTeam: 'Argentina',
    awayTeam: 'Morocco',
    kickoffTime: '2026-06-15T19:00:00-06:00',
    venue: 'Estadio BBVA',
    stage: 'Group Stage',
    matchDay: 'Matchday 4',
    homeFlag: '🇦🇷',
    awayFlag: '🇲🇦',
    group: 'Group D'
  },
  {
    id: 'm-7',
    homeTeam: 'Uruguay',
    awayTeam: 'South Korea',
    kickoffTime: '2026-06-16T18:00:00-06:00',
    venue: 'Estadio Akron',
    stage: 'Group Stage',
    matchDay: 'Matchday 5',
    homeFlag: '🇺🇾',
    awayFlag: '🇰🇷',
    group: 'Group E'
  },
  // Canada Venues
  {
    id: 'm-8',
    homeTeam: 'Canada',
    awayTeam: 'Nigeria',
    kickoffTime: '2026-06-12T17:00:00-07:00',
    venue: 'BC Place',
    stage: 'Group Stage',
    matchDay: 'Matchday 1',
    homeFlag: '🇨🇦',
    awayFlag: '🇳🇬',
    group: 'Group B'
  },
  {
    id: 'm-9',
    homeTeam: 'Belgium',
    awayTeam: 'Saudi Arabia',
    kickoffTime: '2026-06-14T16:00:00-04:00',
    venue: 'BMO Field',
    stage: 'Group Stage',
    matchDay: 'Matchday 3',
    homeFlag: '🇧🇪',
    awayFlag: '🇸🇦',
    group: 'Group F'
  },
  {
    id: 'm-10',
    homeTeam: 'Canada',
    awayTeam: 'Netherlands',
    kickoffTime: '2026-06-17T19:00:00-07:00',
    venue: 'BC Place',
    stage: 'Group Stage',
    matchDay: 'Matchday 6',
    homeFlag: '🇨🇦',
    awayFlag: '🇳🇱',
    group: 'Group B'
  },
  // Knockout Stage
  {
    id: 'm-11',
    homeTeam: 'Winner Group A',
    awayTeam: 'Runner-up Group C',
    kickoffTime: '2026-07-02T16:00:00-05:00',
    venue: 'AT&T Stadium',
    stage: 'Round of 32',
    matchDay: 'Matchday 20',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    group: 'Knockouts'
  },
  {
    id: 'm-12',
    homeTeam: 'Winner Group B',
    awayTeam: 'Runner-up Group A',
    kickoffTime: '2026-07-04T18:00:00-07:00',
    venue: 'SoFi Stadium',
    stage: 'Round of 16',
    matchDay: 'Matchday 22',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    group: 'Knockouts'
  },
  {
    id: 'm-13',
    homeTeam: 'Winner Match 52',
    awayTeam: 'Winner Match 53',
    kickoffTime: '2026-07-10T20:00:00-04:00',
    venue: 'MetLife Stadium',
    stage: 'Quarter-Final',
    matchDay: 'Matchday 28',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    group: 'Knockouts'
  },
  {
    id: 'm-14',
    homeTeam: 'Winner Match 58',
    awayTeam: 'Winner Match 59',
    kickoffTime: '2026-07-14T19:00:00-05:00',
    venue: 'AT&T Stadium',
    stage: 'Semi-Final',
    matchDay: 'Matchday 32',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    group: 'Knockouts'
  },
  {
    id: 'm-15',
    homeTeam: 'Winner Match 61',
    awayTeam: 'Winner Match 62',
    kickoffTime: '2026-07-19T17:00:00-04:00',
    venue: 'MetLife Stadium',
    stage: 'FIFA World Cup Final',
    matchDay: 'Matchday 37',
    homeFlag: '🏳️',
    awayFlag: '🏳️',
    group: 'Final'
  }
];

export function getMatchesByStadium(stadiumName: string): MatchInfo[] {
  return MATCH_SCHEDULE_DB.filter(m => m.venue === stadiumName);
}

export function getMatchById(id: string): MatchInfo | undefined {
  return MATCH_SCHEDULE_DB.find(m => m.id === id);
}
