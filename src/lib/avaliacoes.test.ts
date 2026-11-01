import { describe, expect, it } from 'vitest';
import { mediaMonitorias, criteriosMonitoria } from './avaliacoes';
describe('avaliações separadas', () => {
  it('calcula somente estrelas recebidas de monitorias', () => { expect(mediaMonitorias([{ estrelas: 5 }, { estrelas: 3 }])).toBe(4); });
  it('não inventa média sem avaliações', () => { expect(mediaMonitorias([])).toBeNull(); });
  it('mantém três critérios distintos para cada papel', () => { expect(criteriosMonitoria('monitora')).toHaveLength(3); expect(criteriosMonitoria('aluna')).toHaveLength(3); expect(criteriosMonitoria('aluna')).not.toEqual(criteriosMonitoria('monitora')); });
});