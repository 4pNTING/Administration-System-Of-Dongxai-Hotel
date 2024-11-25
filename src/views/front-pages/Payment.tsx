'use client'

// React Imports
import type { ChangeEvent } from 'react'
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import type { ButtonProps } from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Type Imports
import type { CustomInputHorizontalData } from '@core/components/custom-inputs/types'
import type { PricingPlanType } from '@/types/pages/pricingTypes'

// Component Imports
import CustomInputHorizontal from '@core/components/custom-inputs/Horizontal'
import PricingDialog from '@components/dialogs/pricing'
import OpenDialogOnElementClick from '@components/dialogs/OpenDialogOnElementClick'
import DirectionalIcon from '@components/DirectionalIcon'
import { useSettings } from '@core/hooks/useSettings'
import CustomTextField from '@core/components/mui/TextField'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

// Data
const cardData: CustomInputHorizontalData[] = [
  {
    title: (
      <div className='flex items-center gap-4'>
        <Avatar
          variant='rounded'
          className='is-[58px] bs-[34px]'
          sx={{
            backgroundColor: 'var(--mui-palette-action-hover)',
            '[data-mui-color-scheme="dark"] &': {
              backgroundColor: 'var(--mui-palette-common-white)'
            }
          }}
        >
          <img src='/images/logos/visa.png' alt='plan' className='bs-3' />
        </Avatar>
        <Typography color='text.primary' className='font-medium'>
          Credit Card
        </Typography>
      </div>
    ),
    value: 'credit-card',
    isSelected: true
  },
  {
    title: (
      <div className='flex items-center gap-4'>
        <Avatar
          variant='rounded'
          className='is-[58px] bs-[34px]'
          sx={{
            backgroundColor: 'var(--mui-palette-action-hover)',
            '[data-mui-color-scheme="dark"] &': {
              backgroundColor: 'var(--mui-palette-common-white)'
            }
          }}
        >
          <img src='/images/logos/paypal.png' alt='plan' className='bs-5' />
        </Avatar>
        <Typography color='text.primary' className='font-medium'>
          Paypal
        </Typography>
      </div>
    ),
    value: 'paypal'
  }
]

const countries = ['Australia', 'Brazil', 'Canada', 'India', 'United Arab Emirates', 'United Kingdom', 'United States']

const Payment = ({ data }: { data: PricingPlanType[] }) => {
  // Vars
  const buttonProps: ButtonProps = {
    variant: 'tonal',
    children: 'Change Plan'
  }

  const initialSelected: string = cardData.filter(item => item.isSelected)[
    cardData.filter(item => item.isSelected).length - 1
  ].value

  // States
  const [selectCountry, setSelectCountry] = useState('Brazil')
  const [selectInput, setSelectInput] = useState<string>(initialSelected)

  // Hooks
  const { updatePageSettings } = useSettings()

  const handleCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectCountry(event.target.value)
  }

  const handlePaymentChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelectInput(prop)
    } else {
      setSelectInput((prop.target as HTMLInputElement).value)
    }
  }

  // For Page specific settings
  useEffect(() => {
    return updatePageSettings({
      skin: 'default'
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className={classnames('md:plb-[100px] plb-6', frontCommonStyles.layoutSpacing)}>
      <Card>
        <CardContent className='p-0'>
          <Grid container>
            <Grid item md={12} lg={7}>
              <div className='flex flex-col gap-y-8 p-8 border-be lg:border-be-0 lg:border-e bs-full'>
                <div className='flex flex-col gap-y-2'>
                  <Typography variant='h4'>Checkout</Typography>
                  <Typography color='text.secondary'>
                    All plans include 40+ advanced tools and features to boost your product. Choose the best plan to fit
                    your needs.
                  </Typography>
                </div>
                <div className='flex gap-5'>
                  <Grid container spacing={4}>
                    {cardData.map((item, index) => (
                      <CustomInputHorizontal
                        key={index}
                        type='radio'
                        name='paymemt-method'
                        data={item}
                        selected={selectInput}
                        handleChange={handlePaymentChange}
                        gridProps={{ sm: 6, xs: 12 }}
                      />
                    ))}
                  </Grid>
                </div>
                <div className='flex flex-col gap-6 mbe-1'>
                  <Typography variant='h4'>Billing Details</Typography>
                  <div className='flex sm:flex-row flex-col gap-5'>
                    <CustomTextField fullWidth label='Email Address' placeholder='john.deo@gmail.com' type='email' />
                    <CustomTextField
                      fullWidth
                      type='password'
                      id='password-input'
                      label='Password'
                      placeholder='Password'
                    />
                  </div>
                  <div className='flex sm:flex-row flex-col gap-5'>
                    <CustomTextField
                      select
                      fullWidth
                      label='Billing Country'
                      name='country'
                      variant='outlined'
                      value={selectCountry}
                      onChange={handleCountryChange}
                    >
                      {countries.map((item, index) => (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </CustomTextField>

                    <CustomTextField
                      label='Billing Zip / Postal Code'
                      id='postal-code-input'
                      placeholder='Billing Zip / Postal Code'
                      fullWidth
                      type='number'
                    />
                  </div>
                </div>
                {selectInput === 'credit-card' && (
                  <div className='flex flex-col gap-6 mbe-1'>
                    <Typography variant='h4'>Credit Card Info</Typography>
                    <CustomTextField
                      fullWidth
                      id='card-number-input'
                      placeholder='8763 2345 3478'
                      label='Card Number'
                      type='number'
                    />
                    <div className='flex sm:flex-row flex-col gap-5'>
                      <CustomTextField fullWidth id='card-holder-name' placeholder='John Doe' label='Card Holder' />
                      <div className='flex gap-5'>
                        <CustomTextField
                          fullWidth
                          id='expiry-date'
                          placeholder='05/2026'
                          label='EXP. date'
                          type='number'
                        />
                        <CustomTextField fullWidth id='cvv' placeholder='734' label='CVV' type='number' />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Grid>
            <Grid item md={12} lg={5}>
              <div className='flex flex-col gap-8 p-8'>
                <div className='flex flex-col gap-2'>
                  <Typography variant='h4'>Order Summary</Typography>
                  <Typography color='text.secondary'>
                    It can help you manage and service orders before, during, and after fulfillment.
                  </Typography>
                </div>
                <div className='flex flex-col gap-5'>
                  <div className='flex flex-col gap-4 p-6 bg-actionHover rounded'>
                    <Typography color='text.secondary'>A simple start for everyone</Typography>
                    <div className='flex items-baseline'>
                      <Typography variant='h1'>$59.99</Typography>
                      <Typography component='sub' color='text.secondary'>
                        /month
                      </Typography>
                    </div>
                    <OpenDialogOnElementClick
                      element={Button}
                      elementProps={buttonProps}
                      dialog={PricingDialog}
                      dialogProps={{ data }}
                    />
                  </div>
                  <div>
                    <div className='flex gap-2 items-center justify-between mbe-2'>
                      <Typography color='text.secondary'>Subscription</Typography>
                      <Typography color='text.primary' className='font-medium'>
                        $85.99
                      </Typography>
                    </div>
                    <div className='flex gap-2 items-center justify-between'>
                      <Typography color='text.secondary'>Tax</Typography>
                      <Typography color='text.primary' className='font-medium'>
                        $4.99
                      </Typography>
                    </div>
                    <Divider className='mlb-4' />
                    <div className='flex gap-2 items-center justify-between'>
                      <Typography color='text.secondary'>Total</Typography>
                      <Typography color='text.primary' className='font-medium'>
                        $90.98
                      </Typography>
                    </div>
                  </div>
                  <Button
                    variant='contained'
                    color='success'
                    endIcon={<DirectionalIcon ltrIconClass='tabler-arrow-right' rtlIconClass='tabler-arrow-left' />}
                  >
                    Proceed With Payment
                  </Button>
                </div>
                <Typography color='text.secondary'>
                  By continuing, you accept to our Terms of Services and Privacy Policy. Please note that payments are
                  non-refundable.
                </Typography>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </section>
  )
}

export default Payment
