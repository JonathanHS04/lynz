import React from 'react'
import RankingInfo from '@/components/RankingInfo';

const Profile = ({ data }) => {
    return (
        <>
            <section className="space-y-4">
                <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-violet-500 pl-4 py-1">
                    "{data.description}"
                </p>
            </section>

            <RankingInfo albumData={data} />
        </>
    )
}

export default Profile