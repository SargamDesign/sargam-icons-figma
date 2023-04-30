import '!./ui.css'

import {
	Container,
	Divider,
	Bold,
	render,
	Text,
	Muted,
	VerticalSpace,
	SearchTextbox,
	DropdownOption,
	Dropdown,
	Columns
} from '@create-figma-plugin/ui'
import {
	emit,
} from '@create-figma-plugin/utilities'

import { h, JSX } from 'preact'
import { useState } from 'preact/hooks'
import { version, icons } from './icons.json'
import useSearch from './use-search'

type Icon = {
	name: string,
	svg: string,
	category: string,
	tags: string[]
}

function IconButton({
	icon,
	stroke
}: {
	icon: Icon,
	stroke: string
}) {
	const svg = icon.svg
		.replace('stroke-width="2"', `stroke-width="${stroke}"`)

	const handleClick = (name: string, svg: string) => {
		emit('SUBMIT', {
			name,
			svg
		})
	}

	return (
		<button
			key={icon.name}
			aria-label={icon.name}
			onClick={() => handleClick(icon.name, svg)}
			class="icon-button"
			dangerouslySetInnerHTML={{ __html: svg }}
		>
		</button>
	)
}

function Plugin() {
	const [search, setSearch] = useState<string>('')
	const [category, setCategory] = useState<string>('')
	const [type, setStroke] = useState<string>('2')

	const results = useSearch(search, category)
	const limit = 102

	function handleInput(event: JSX.TargetedEvent<HTMLInputElement>) {
		setSearch(event.currentTarget.value)
	}

	function handleCategoryChange(event: JSX.TargetedEvent<HTMLInputElement>) {
		setCategory(event.currentTarget.value)
	}

	function handleStrokeChange(event: JSX.TargetedEvent<HTMLInputElement>) {
		setStroke(event.currentTarget.value)
	}

	let c: string[] = []
	icons.forEach((i) => {
		if(i.category != '' && c.indexOf(i.category) === -1) {
			c.push(i.category)
		}
	})

	c.sort()

	const categories: Array<DropdownOption> = [
		{ value: '', text: 'All categories' },
	]

	c.forEach((i) => {
		categories.push({
			value: i,
			text: i
		})
	})

	const type: Array<DropdownOption> = [
		{ value: '', text: 'Line' },
		{ value: '', text: 'Duotone' },
		{ value: '', text: 'Fill' },
	]

	return (
		<div>
			<div class="search">
				<SearchTextbox
					onInput={handleInput}
					placeholder={`Search ${icons.length} icons`}
					value={search}
				/>
				<Divider />
				<Container space="extraSmall">
					<VerticalSpace space="extraSmall" />
					<Columns space="small">
						<Dropdown onChange={handleCategoryChange} options={categories} value={category} />
						<Dropdown onChange={handleStrokeChange} options={type} value={type} />
					</Columns>
					<VerticalSpace space="extraSmall" />
				</Container>
				<Divider />
			</div>
			<Container space="small">
				<VerticalSpace space="small" />
				{(search || category != '') && (
					<div>
						<Text>
							<Bold>
								Icons
								{search && ` matched "${search}"`}
								{category != '' && ` in category "${category}"`}
								{":"}
							</Bold>
						</Text>
						<VerticalSpace space="small" />
					</div>
				)}
			</Container>
			<Container space="small">
				<div class="grid">
					{results.slice(0, limit).map(icon => (
						<IconButton icon={icon} stroke={stroke}/>
					))}
				</div>
				{results.length === 0 && (
					<div>
						<VerticalSpace space="medium" />
						<Text align="center">
							<Muted>Sorry, we don't have any icon to match your query.</Muted>
						</Text>
						<VerticalSpace space="large" />
					</div>
				)}
				{results.length - limit > 0 && (
					<div>
						<VerticalSpace space="medium" />
						<Text align="center">
						<Muted>Request a new icon by creating <a href="#">an issue here</a>.</Muted>
						</Text>
					</div>
				)}
				<VerticalSpace space="extraLarge" />
				<Text>
					<Muted>Sargam Icons v{version}</Muted>
				</Text>
				<VerticalSpace space="medium" />
			</Container>
		</div>
	)
}

export default render(Plugin)
