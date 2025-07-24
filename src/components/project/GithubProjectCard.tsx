"use client";

import { ProjectItemType } from "@/config/infoConfig";
import { utm_source } from "@/config/siteConfig";
import Link from "next/link";
import { CustomIcon } from "../shared/CustomIcon";

export function GithubProjectCard({
	project,
	titleAs,
}: {
	project: ProjectItemType;
	titleAs?: keyof JSX.IntrinsicElements;
}) {
	const utmLink = `https://${project.link.href}?utm_source=${utm_source}`;
	let Component = titleAs ?? "h2";
	return (
		<li className="group relative flex h-full flex-col items-start">
			<div className="relative flex h-full w-full flex-col justify-between rounded-2xl  border border-muted-foreground/20 px-6 py-5 shadow-sm transition-all group-hover:scale-[1.03] group-hover:bg-muted/5 group-hover:shadow-md">
				{/* Hover 灰色蒙层和提示（底部横条） */}
				<div className="pointer-events-none absolute left-0 right-0 bottom-0 z-30 flex h-9 items-center justify-center rounded-b-2xl bg-gray-900/70 opacity-0 transition-opacity group-hover:opacity-100">
					<span className="text-white text-xs font-semibold select-none">
						{project.link.href.startsWith("http") ? "Go live" : "Go to Github"}
					</span>
				</div>
				{/* 卡片内容 */}
				<div className="">
					<div className="flex flex-col items-start justify-center gap-2 sm:flex-row sm:items-center sm:justify-start">
						<CustomIcon name="book-open" size={20} />
						<Component className="text-sm font-semibold tracking-tight">
							{project.name}
						</Component>
					</div>
					<p className="relative z-10 mt-2 text-sm text-muted-foreground">
						{project.description}
					</p>
				</div>

				<div className="relative z-10 mt-auto pt-4">
					<div className="flex flex-row items-center gap-2 text-xs font-semibold opacity-80">
						{project.achievement && (
							<p className="flex items-center gap-1 text-xs text-foreground">
								<CustomIcon name="achievement" size={16} />
								{project.achievement}
							</p>
						)}
					</div>
					<div className="flex flex-row items-center gap-2 text-xs font-semibold opacity-80">
						{project.gitStars && (
							<>
								<CustomIcon name="star" size={16} />
								{project.gitStars}
							</>
						)}
						{project.gitForks && (
							<>
								<CustomIcon name="git-fork" size={16} />
								{project.gitForks}
							</>
						)}
					</div>
				</div>
				<Link
					href={utmLink}
					target="_blank"
					rel="noopener noreferrer"
					className="absolute inset-0 z-20"
				>
					<CustomIcon
						name="arrow-right"
						size={32}
						className="absolute bottom-6 right-4 h-4 w-4 group-hover:cursor-pointer group-hover:text-primary"
					/>
				</Link>
			</div>
		</li>
	);
}
