'use client';

import { useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';



import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
import {
  _analyticTasks,
  _analyticPosts,
  _analyticTraffic,
  _analyticOrderTimeline,
} from 'src/_mock';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

import { _bookings, _bookingNew, _bookingReview, _bookingsOverview } from 'src/_mock';
import {
  BookingIllustration,
  CheckInIllustration,
  CheckoutIllustration,
} from 'src/assets/illustrations';

import { BookingBooked } from '../booking-booked';
import { BookingNewest } from '../booking-newest';
import { BookingDetails } from '../booking-details';
import { BookingAvailable } from '../booking-available';
import { BookingStatistics } from '../booking-statistics';
import { BookingTotalIncomes } from '../booking-total-incomes';
import { BookingWidgetSummary } from '../booking-widget-summary';
import { BookingCheckInWidgets } from '../booking-check-in-widgets';
import { BookingCustomerReviews } from '../booking-customer-reviews';


import { SeoIllustration } from 'src/assets/illustrations';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { AppWelcome } from '../app-welcome';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { AppCurrentDownload } from '../app-current-download';

import { EcommerceSaleByGender } from '../ecommerce-sale-by-gender';

import { GetuserCount, useGetUsers } from 'src/actions/users';

import { useGetStudents } from 'src/actions/student';
import { useGetMaterias, useGetCount } from 'src/actions/materia';
import { useGetClases } from 'src/actions/clases';
// ----------------------------------------------------------------------

export function OverviewView() {
  const role = sessionStorage.getItem("role")

  const [users, setUsersData] = useState([]);
  useEffect(() => {
    useGetUsers().then(result => setUsersData(result.data));
  }, [])

  const [students, setStudents] = useState([]);
  useEffect(() => {
    useGetStudents().then(result => setStudents(result.data));
  }, [])

  const [materias, setMaterias] = useState([]);
  useEffect(() => {
    useGetMaterias().then(result => setMaterias(result.data));
  }, [])

  const [clases, setClases] = useState([]);
  useEffect(() => {
    useGetClases().then(result => setClases(result.data));
  }, [])

  const [countAdmin, setAdmin] = useState(0);
  useEffect(() => {
    GetuserCount("admin").then(result => setAdmin(result.count));
  }, [])

  const [countstaff, setStaff] = useState(0);
  useEffect(() => {
    GetuserCount("staff").then(result => setStaff(result.count));
  }, [])

  const [countDocent, setDocent] = useState(0);
  useEffect(() => {
    GetuserCount("docent").then(result => setDocent(result.count));
  }, [])

  const [countStudent, setStudent] = useState(0);
  useEffect(() => {
    GetuserCount("student").then(result => setStudent(result.count));
  }, [])

  const [counts, setCounts] = useState({});
  useEffect(() => {
    useGetCount().then(result => setCounts(result.count));
  }, [])


  const theme = useTheme();
  if (role == "admin"){
    return (
      <DashboardContent maxWidth="xl">
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <AppWelcome
              title={`Bienvenido de nuevo 👋`}
              img={<SeoIllustration hideBackground />}
              action={
                <Button variant="contained" color="primary">
                  Vamos!
                </Button>
              }
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Usuarios"
              total={users.length}
              icon={
                <img
                  alt="icon"
                  src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`}
                />
              }
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Estudiantes"
              total={students.length}
              color="secondary"
              icon={
                <img
                  alt="icon"
                  src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`}
                />
              }
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Clases"
              total={clases.length}
              color="warning"
              icon={
                <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/navbar/ic-class.svg`} />
              }
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Materias"
              total={materias.length}
              color="info"
              icon={
                <img
                  alt="icon"
                  src={`${CONFIG.site.basePath}/assets/icons/navbar/ic-blog.svg`}
                />
              }
            />
          </Grid>
  
          <Grid xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Usuarios"
              subheader="Manerjo de vistas por rol"
              chart={{
                series: [
                  { label: 'Admin', value: countAdmin },
                  { label: 'Staff', value: countstaff },
                  { label: 'Student', value: countStudent },
                  { label: 'Docent', value: countDocent },
                ],
              }}
            />
          </Grid>
  
          <Grid xs={12} md={6} lg={4}>
            <EcommerceSaleByGender
              title="Estudiantes por genero"
              total= {2}
              chart={{
                series: [
                  { label: 'Masculino', value: 2 },
                  { label: 'Femenino', value: 0 },
                ],
              }}
            />
          </Grid>
          <Grid xs={12} md={6} lg={4}>
            <AnalyticsCurrentVisits
              title="Materias"
              chart={{
                series: [
                  { label: 'Matematicas', value: 1 },
                  { label: 'Geografia', value: 1 },
                  { label: 'Historia', value: 1 },
                  { label: 'Biologia', value: 0 },
                ],
              }}
            />
        </Grid>
  
        </Grid>
      </DashboardContent>
    );
  }
  else if (role == "staff"){
    return (
      <DashboardContent maxWidth="xl">
        <Grid container spacing={3}>
        <Grid xs={12} md={12}>
            <AppWelcome
              title={`Bienvenido de nuevo 👋`}
              img={<SeoIllustration hideBackground />}
              action={
                <Button variant="contained" color="primary">
                  Vamos!
                </Button>
              }
            />
          </Grid>
          {/* <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Weekly sales"
              percent={2.6}
              total={714000}
              icon={
                <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-bag.svg`} />
              }
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [22, 8, 35, 50, 82, 84, 77, 12],
              }}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="New users"
              percent={-0.1}
              total={1352831}
              color="secondary"
              icon={
                <img
                  alt="icon"
                  src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-users.svg`}
                />
              }
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [56, 47, 40, 62, 73, 30, 23, 54],
              }}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Purchase orders"
              percent={2.8}
              total={1723315}
              color="warning"
              icon={
                <img alt="icon" src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-buy.svg`} />
              }
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [40, 70, 50, 28, 70, 75, 7, 64],
              }}
            />
          </Grid>
  
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Messages"
              percent={3.6}
              total={234}
              color="error"
              icon={
                <img
                  alt="icon"
                  src={`${CONFIG.site.basePath}/assets/icons/glass/ic-glass-message.svg`}
                />
              }
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                series: [56, 30, 23, 54, 47, 40, 62, 73],
              }}
            />
          </Grid> */}

        </Grid>
      </DashboardContent>
    );
  }
  else if (role == "docent"){
    return (
      <DashboardContent maxWidth="xl">
        <Grid container spacing={3} disableEqualOverflow>
          <Grid xs={12} md={12}>
            <AppWelcome
              title={`Bienvenido de nuevo 👋`}
              img={<SeoIllustration hideBackground />}
              action={
                <Button variant="contained" color="primary">
                  Vamos!
                </Button>
              }
            />
        </Grid>      
          {/* <Grid xs={12}>
            <BookingNewest
              title="Materias Asignadas"
              list={_bookingNew}
            />
          </Grid> */}
  
        </Grid>
      </DashboardContent>
    );
  }
  
}
