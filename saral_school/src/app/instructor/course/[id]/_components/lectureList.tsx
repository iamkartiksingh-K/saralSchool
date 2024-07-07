"use client";
import { useState, useEffect } from "react";
import { lectureType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Grip, Pencil } from "lucide-react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
interface ChapterListProps {
	items: lectureType[];
	onReorder: (updateData: { lecture_id: string; position: number }[]) => void;
	onEdit: (lecutre_id: string) => void;
}

export function LectureList({ items, onReorder, onEdit }: ChapterListProps) {
	const [isMounted, setIsMounted] = useState(false);
	const [lectures, setLectures] = useState(items);
	useEffect(() => {
		setIsMounted(true);
	}, []);
	useEffect(() => {
		setLectures(items);
	}, [items]);
	// we are doing this because "use client" doesn't mean that
	// it won't be rendered on server side, it will first rendered on server
	// then sent to client and drag and drop package is not optimised for server side
	// so it will throw hydration error as what is loaded on server side
	// will be different from client side.
	const onDragEnd = (result: DropResult) => {
		if (!result.destination) return;
		const items = Array.from(lectures);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		const startIndex = Math.min(
			result.source.index,
			result.destination.index
		);
		const endIndex = Math.max(
			result.source.index,
			result.destination.index
		);
		const updatedLectures = items.slice(startIndex, endIndex + 1);
		setLectures(items);
		const bulkUpdateData = updatedLectures.map((lecture) => ({
			lecture_id: lecture.lecture_id,
			position: items.findIndex(
				(item) => item.lecture_id === lecture.lecture_id
			),
		}));
		onReorder(bulkUpdateData);
	};
	if (!isMounted) {
		return null;
	}
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId='lectures'>
				{(provided) => (
					<div {...provided.droppableProps} ref={provided.innerRef}>
						{lectures.map((lecture, index) => (
							<Draggable
								draggableId={`${lecture.lecture_id}`}
								key={`${lecture.lecture_id}`}
								index={index}>
								{(provided) => (
									<div
										className={cn(
											"flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
											lecture.publishedAt &&
												"bg-sky-100 border-sky-200 text-sky-700"
										)}
										ref={provided.innerRef}
										{...provided.draggableProps}>
										<div
											className={cn(
												"px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
												lecture.publishedAt &&
													"border-r-sky-200 hover:bg-sky-200"
											)}
											{...provided.dragHandleProps}>
											<Grip className='h-5 w-5' />
										</div>
										{lecture.name}
										<div className='ml-auto pr-2 flex items-center gap-x-2'>
											{lecture.isFree && (
												<Badge>Free</Badge>
											)}
											<Badge
												className={cn(
													"bg-slate-500",
													lecture.publishedAt &&
														"bg-sky-700"
												)}>
												{lecture.publishedAt
													? "Published"
													: "Draft"}
											</Badge>
											<Pencil
												onClick={() =>
													onEdit(lecture.lecture_id)
												}
												className='w-4 h-4 cursor-pointer hover:opacity-75 transition'
											/>
										</div>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}
