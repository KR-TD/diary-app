import DiaryPage from "../../../diary-page"

export default function BoardPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div>
      <DiaryPage boardId={id} />
    </div>
  )
}