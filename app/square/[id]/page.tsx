import SquareDetailClient from './SquareDetailClient';

// 为静态导出生成动态路由参数
export function generateStaticParams() {
	return [
		{ id: '1' },
		{ id: '2' },
		{ id: '3' },
		{ id: '4' },
		{ id: '5' }
	];
}

export default function SquareDetailPage({ params }: { params: { id: string } }) {
	return <SquareDetailClient params={params} />;
}
