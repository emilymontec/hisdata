import { isLikelySamePerson } from '../duplicate-detection.util';

describe('isLikelySamePerson', () => {
  it('detecta coincidencia cuando el nombre y la fecha de nacimiento son iguales, ignorando tildes y mayúsculas', () => {
    const a = { firstName: 'María José', lastName: 'Pérez', dateOfBirth: new Date('1990-05-10') };
    const b = { firstName: 'maria jose', lastName: 'perez', dateOfBirth: new Date('1990-05-10') };
    expect(isLikelySamePerson(a, b)).toBe(true);
  });

  it('no marca coincidencia si la fecha de nacimiento difiere', () => {
    const a = { firstName: 'Juan', lastName: 'Gómez', dateOfBirth: new Date('1985-01-01') };
    const b = { firstName: 'Juan', lastName: 'Gómez', dateOfBirth: new Date('1990-01-01') };
    expect(isLikelySamePerson(a, b)).toBe(false);
  });

  it('no marca coincidencia si el nombre difiere', () => {
    const a = { firstName: 'Ana', lastName: 'Ruiz', dateOfBirth: new Date('1995-03-20') };
    const b = { firstName: 'Andrea', lastName: 'Ruiz', dateOfBirth: new Date('1995-03-20') };
    expect(isLikelySamePerson(a, b)).toBe(false);
  });
});
