import * as React from 'react';
import { fnWorker, fetchWorker } from 'worker-mate';

export const Test: React.FC = () => {
  const [hard, setHard] = React.useState<number>();
  const [star, setStar] = React.useState<{
    name: string;
    model: string;
    manufacturer: string;
  }>({
    name: '',
    model: '',
    manufacturer: '',
  });

  React.useEffect(() => {
    let start = performance.now();

    function fibonacci(n, memo = {}) {
      if (memo[n]) return memo[n];
      if (n <= 1) return 1;
      return (memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo));
    }
    fnWorker(fibonacci, 2000).then((d) => {
      setHard(performance.now() - start);
    });
    fetchWorker<{
      name: string;
      model: string;
      manufacturer: string;
    }>({
      url: 'https://swapi.dev/api/starships/2',
      options: void 0,
      requestMiddleware: void 0,
      responseMiddleware: void 0,
      retry: {
        attempts: 5,
        delay: 1000,
      },
    })
      .then(({ name, model, manufacturer }) => {
        setStar({
          name: name ?? '',
          model: model ?? '',
          manufacturer: manufacturer ?? '',
        });
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div>
      <h1>the meaning of life is {hard}</h1>
      <ul>
        <li>{star.name}</li>
        <li>{star.model}</li>
        <li>{star.manufacturer}</li>
      </ul>
    </div>
  );
};
