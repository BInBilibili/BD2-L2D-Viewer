import part1 from './changelog-zh-part1.json'
import part2 from './changelog-zh-part2.json'

type ChangelogEntry = {
  date: string
  changes: string[]
}

const changelogZh: ChangelogEntry[] = [...(part1 as ChangelogEntry[]), ...(part2 as ChangelogEntry[])]

export default changelogZh
