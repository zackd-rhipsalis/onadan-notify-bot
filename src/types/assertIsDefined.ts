type NonNullable <T extends {}> = {
  readonly [P in keyof T]-?: Exclude<T[P], null | undefined>;
}

type AssertIsDefined = <T extends {}> (
  props: T
) => asserts props is NonNullable<T>;

export const assertIsDefined : AssertIsDefined = (props) => {
  Object.entries(props).forEach(([key, val]) => {
    if (typeof val === 'undefined' || val === null) {
      throw new Error(`The value of ${key} is null it should be...`);
    }
  });
}