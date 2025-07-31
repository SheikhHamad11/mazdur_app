import { View, Text } from 'react-native'
import React from 'react'
import AppText from '../../components/AppText'
import { ScrollView } from 'react-native-gesture-handler'
import CommonHeader from '../../components/CommonHeader'

export default function About() {
    return (
        <>
            <CommonHeader title="About" />
            <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }} >

                <AppText style={{ lineHeight: 20, marginBottom: 40 }}><AppText font='bold'>Mazdur App –</AppText>  The Digital Platform for Daily Wage Workers & Employers
                    Mazdur App is a user-friendly mobile application created to empower daily wage workers (mazdurs), skilled laborers, and small-scale employers by simplifying the process of finding and offering labor-related jobs. Whether you are a laborer looking for work or an employer in need of trustworthy manpower, Mazdur bridges the gap and brings both sides together on a single digital platform.
                    {'\n'}{'\n'}
                    <AppText font='bold'>In countries – </AppText>like Pakistan, India, Bangladesh, and other parts of South Asia, millions of hardworking individuals rely on daily wage work to earn a living. However, finding consistent work or reliable workers remains a challenge. Mazdur solves this problem by making job search and hiring fast, reliable, and accessible to everyone, especially those in low-income communities.
                    {'\n'}{'\n'}
                    <AppText font='bold'>For Laborers & Workers : </AppText>
                    Mazdur is built with laborers in mind. If you're a daily wage worker, plumber, electrician, carpenter, mason, painter, cleaner, or any other skilled/unskilled worker, this app helps you:
                    {'\n'}{'\n'}
                    <AppText font='bold'>Create your profile : </AppText>Add your name, photo, skills, work experience, preferred location, and contact details so employers can find you easily.
                    {'\n'}{'\n'}
                    <AppText font='bold'>Find jobs instantly : </AppText>See available job opportunities in your area with filters for trade, location, and timing.
                    {'\n'}{'\n'}
                    <AppText font='bold'>Get hired directly : </AppText>Employers can contact you for work directly through the app.
                    {'\n'}{'\n'}
                    <AppText font='bold'>Build your credibility : </AppText>Complete jobs, get rated by employers, and improve your visibility in the app.
                    {'\n'}{'\n'}
                    <AppText font='bold'>Receive work notifications : </AppText>Get alerts for nearby jobs that match your skillset.
                    {'\n'}{'\n'}

                    <AppText font='bold'>For Employers, Contractors & Builders : </AppText>
                    Hiring the right person for labor-intensive tasks can be difficult. Mazdur makes it easier than ever to find reliable workers for any job, big or small.
                    {'\n'}{'\n'}
                    <AppText font='bold'>Post job requirements : </AppText>Create a listing in seconds. Add job details like type of work, duration, budget, and preferred worker experience.
                    {'\n'}{'\n'}
                    <AppText font='bold'>Browse worker profiles : </AppText>Find verified laborers with their photos, skills, and past ratings.
                    {'\n'}{'\n'}
                    <AppText font='bold'>Direct contact : </AppText>Call or message workers within the app to discuss work details and availability.
                    {'\n'}{'\n'}
                    <AppText font='bold'>Rate workers : </AppText>Share feedback after the job is complete to help others and maintain accountability.
                    {'\n'}{'\n'}
                    <AppText font='bold'>Hire faster : </AppText> With real-time availability and location filtering, you’ll find the right person in no time.
                    {'\n'}{'\n'}
                    <AppText font='bold'>🔑 Key Features:</AppText>
                    {'\n'}{'\n'}
                    <AppText font='medium'>📍Location-based search:</AppText> Find jobs and workers near your area.
                    {'\n'}{'\n'}
                    <AppText font='medium'>🛠️ Wide range of trades supported:</AppText> Masonry, plumbing, carpentry, cleaning, construction, electricians, painters, and more.
                    {'\n'}{'\n'}
                    <AppText font='medium'>🔒 Safe & secure:</AppText> Your data is private and protected.
                    {'\n'}{'\n'}
                    <AppText font='medium'>🔔 Instant alerts:</AppText> Get job notifications directly on your phone.
                    {'\n'}{'\n'}
                    <AppText font='medium'>💬 In-app communication:</AppText> Employers and workers can connect easily without sharing personal numbers (optional).
                    {'\n'}{'\n'}
                    <AppText font='medium'>🌐 Bilingual interface:</AppText> Supports Urdu and English, making it accessible to all.
                    {'\n'}{'\n'}
                    <AppText font='bold'>Why Mazdur ? </AppText>
                    Mazdur is more than just a job app. It’s a mission.
                    We believe every worker deserves dignity, opportunity, and fair treatment. We are committed to improving the lives of daily wage earners by offering:
                    {'\n'}{'\n'}
                    <AppText font='bold'>Consistent access to work : </AppText>

                    A platform to showcase their skills
                    Protection from middlemen and exploitation
                    A pathway to digital inclusion and economic empowerment
                    Employers benefit from transparency, accountability, and the ease of hiring directly from a trusted labor pool.</AppText>
            </ScrollView>
        </>
    )
}