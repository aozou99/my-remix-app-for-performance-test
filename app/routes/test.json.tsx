import { hrtime } from 'node:process';
import { type LoaderFunction, json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

function generateLargeObject(size: number) {
    const obj: Record<string, number> = {};
    for (let i = 0; i < size; i++) {
        obj[`key${i}`] = Math.random();
    }
    return obj;
}

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const size = Number.parseInt(url.searchParams.get('size') || '1000', 10);
    const operations = url.searchParams.get('operations')?.split(',') || ['generate', 'serialize', 'deserialize'];

    const results: Record<string, number> = {};
    let largeObject: Record<string, number> = {};
    let serialized = '';

    if (operations.includes('generate')) {
        const startGenerate = hrtime();
        largeObject = generateLargeObject(size);
        const endGenerate = hrtime(startGenerate);
        results.generateTime = endGenerate[0] * 1000 + endGenerate[1] / 1e6;
    }

    if (operations.includes('serialize')) {
        const startSerialize = hrtime();
        serialized = JSON.stringify(largeObject);
        const endSerialize = hrtime(startSerialize);
        results.serializeTime = endSerialize[0] * 1000 + endSerialize[1] / 1e6;
    }

    if (operations.includes('deserialize')) {
        const startDeserialize = hrtime();
        JSON.parse(serialized);
        const endDeserialize = hrtime(startDeserialize);
        results.deserializeTime = endDeserialize[0] * 1000 + endDeserialize[1] / 1e6;
    }

    results.totalTime = Object.values(results).reduce((a, b) => a + b, 0);
    results.objectSize = serialized.length;

    return json({
        size,
        operations,
        ...results,
        serialized,
    });
};

export default function TestJson() {
    const data = useLoaderData<typeof loader>();

    // バイトをKBとMBに変換する関数を追加
    const formatSize = (bytes: number) => {
        const kb = bytes / 1024;
        const mb = kb / 1024;
        return `${bytes.toLocaleString()} バイト (${kb.toFixed(2)} KB, ${mb.toFixed(2)} MB)`;
    };

    return (
        <div className='max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg'>
            <h1 className='text-3xl font-bold mb-6 text-gray-800 dark:text-white'>
                JSON シリアライズ/デシリアライズ パフォーマンステスト
            </h1>
            <div className='mb-6 bg-blue-100 dark:bg-blue-900 p-4 rounded-md'>
                <p className='text-blue-800 dark:text-blue-200 mb-2'>
                    URLパラメータ 'size' でオブジェクトのサイズを、'operations' で実行する操作を指定できます。
                </p>
                <p className='text-blue-800 dark:text-blue-200 font-semibold'>
                    例: /test/json?size=10000&operations=generate,serialize
                </p>
            </div>

            <h2 className='text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300'>テスト結果：</h2>
            <ul className='space-y-3'>
                <li className='flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded'>
                    <span className='font-medium text-gray-700 dark:text-gray-300'>オブジェクトサイズ:</span>
                    <span className='text-gray-900 dark:text-gray-100'>{data.size}</span>
                </li>
                <li className='flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded'>
                    <span className='font-medium text-gray-700 dark:text-gray-300'>実行された操作:</span>
                    <span className='text-gray-900 dark:text-gray-100'>{data.operations.join(', ')}</span>
                </li>
                {data.generateTime !== undefined && (
                    <li className='flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded'>
                        <span className='font-medium text-gray-700 dark:text-gray-300'>生成時間:</span>
                        <span className='text-gray-900 dark:text-gray-100'>{data.generateTime.toFixed(2)} ミリ秒</span>
                    </li>
                )}
                {data.serializeTime !== undefined && (
                    <li className='flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded'>
                        <span className='font-medium text-gray-700 dark:text-gray-300'>シリアライズ時間:</span>
                        <span className='text-gray-900 dark:text-gray-100'>{data.serializeTime.toFixed(2)} ミリ秒</span>
                    </li>
                )}
                {data.deserializeTime !== undefined && (
                    <li className='flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded'>
                        <span className='font-medium text-gray-700 dark:text-gray-300'>デシリアライズ時間:</span>
                        <span className='text-gray-900 dark:text-gray-100'>
                            {data.deserializeTime.toFixed(2)} ミリ秒
                        </span>
                    </li>
                )}
                <li className='flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded'>
                    <span className='font-medium text-gray-700 dark:text-gray-300'>合計時間:</span>
                    <span className='text-gray-900 dark:text-gray-100'>{data.totalTime.toFixed(2)} ミリ秒</span>
                </li>
                <li className='flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-3 rounded'>
                    <span className='font-medium text-gray-700 dark:text-gray-300'>
                        シリアライズされたオブジェクトのサイズ:
                    </span>
                    <span className='text-gray-900 dark:text-gray-100'>{formatSize(data.objectSize)}</span>
                </li>
            </ul>
            <div className='mt-6'>
                <h3 className='text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300'>
                    シリアライズされたオブジェクト:
                </h3>
                <pre className='bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto'>
                    <code className='text-sm text-gray-800 dark:text-gray-200'>{data.serialized}</code>
                </pre>
            </div>
        </div>
    );
}