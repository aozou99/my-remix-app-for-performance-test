import { type LoaderFunction, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

// 単純なコンポーネント
const SimpleComponent = ({ index }: { index: number }) => <div>Component {index}</div>;

// ローダー関数
export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const count = Number.parseInt(url.searchParams.get('count') || '100', 10);
    return json({ count });
};

// メインコンポーネント
export default function TestRender() {
    const { count } = useLoaderData<typeof loader>();

    return (
        <div>
            <h1>レンダリングテスト</h1>
            <p>コンポーネント数: {count}</p>
            <div>
                {Array.from({ length: count }, (_, i) => (
                    <SimpleComponent key={i} index={i} />
                ))}
            </div>
        </div>
    );
}
