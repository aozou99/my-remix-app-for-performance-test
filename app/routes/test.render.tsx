import { type LoaderFunction, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

// 単純なコンポーネント
const SimpleComponent = ({ index }: { index: number }) => <div>Component {index}</div>;

// JavaScript処理を含むコンポーネント
const ComplexComponent = ({ index }: { index: number }) => {
    const fibonacci = (n: number): number => {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    };

    // 50から100までのランダムな整数を生成
    const randomNumber = Math.floor(Math.random() * 20) + 20;
    const result = fibonacci(randomNumber);

    return (
        <div>
            Complex Component {index}: Fibonacci({randomNumber}) = {result}
        </div>
    );
};

// ローダー関数
export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const count = Number.parseInt(url.searchParams.get('count') || '100', 10);
    const useComplex = url.searchParams.get('complex') === 'true';
    return json({ count, useComplex });
};

// メインコンポーネント
export default function TestRender() {
    const { count, useComplex } = useLoaderData<typeof loader>();

    const ComponentToRender = useComplex ? ComplexComponent : SimpleComponent;

    return (
        <div>
            <h1>レンダリングテスト</h1>
            <p>コンポーネント数: {count}</p>
            <p>コンポーネントタイプ: {useComplex ? '複雑' : '単純'}</p>
            <div>
                {Array.from({ length: count }, (_, i) => (
                    <ComponentToRender key={i} index={i} />
                ))}
            </div>
        </div>
    );
}
