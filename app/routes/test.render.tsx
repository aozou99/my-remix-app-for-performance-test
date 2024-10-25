import { type LoaderFunction, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

// 単純なコンポーネント
const SimpleComponent = ({ index }: { index: number }) => (
    <div className='bg-gray-100 dark:bg-gray-700 p-2 rounded mb-2'>Component {index}</div>
);

// JavaScript処理を含むコンポーネント
const ComplexComponent = ({ index }: { index: number }) => {
    const fibonacci = (n: number): number => {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    };

    const randomNumber = Math.floor(Math.random() * 20) + 20;
    const result = fibonacci(randomNumber);

    return (
        <div className='bg-blue-100 dark:bg-blue-800 p-2 rounded mb-2'>
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
        <div className='max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg'>
            <h1 className='text-3xl font-bold mb-6 text-gray-800 dark:text-white'>レンダリングテスト</h1>
            <div className='mb-6 bg-yellow-100 dark:bg-yellow-900 p-4 rounded-md'>
                <p className='text-yellow-800 dark:text-yellow-200 mb-2'>
                    URLパラメータ 'count' でコンポーネント数を、'complex'
                    で複雑なコンポーネントを使用するかどうかを指定できます。
                </p>
                <p className='text-yellow-800 dark:text-yellow-200 font-semibold'>
                    例: /test/render?count=50&complex=true
                </p>
            </div>
            <div className='mb-4 space-y-2'>
                <p className='text-lg text-gray-700 dark:text-gray-300'>
                    コンポーネント数: <span className='font-semibold'>{count}</span>
                </p>
                <p className='text-lg text-gray-700 dark:text-gray-300'>
                    コンポーネントタイプ: <span className='font-semibold'>{useComplex ? '複雑' : '単純'}</span>
                </p>
            </div>
            <div className='space-y-2'>
                {Array.from({ length: count }, (_, i) => (
                    <ComponentToRender key={i} index={i} />
                ))}
            </div>
        </div>
    );
}
