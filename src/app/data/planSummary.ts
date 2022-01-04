
export enum featureType {
    TEXT="text",
    HEADER="header",
    SUBHEADER="subheader"
}

export enum AllPlans  {
    TOPAZ="TOPAZ",
    SAPPHIRE="SAPHIRE",
    EMERALD="EMERALD",
    RUBY="RUBY",
    DIAMOND="DIAMOND"
}

type planFeature = {
    text:string;
    type: featureType
}

type plans = planFeature[];

const TOPAZ : plans = [
            
           {
            text: AllPlans.TOPAZ,
            type:featureType.HEADER
           },

           {
               text:"Registration",
               type:featureType.TEXT
           },
        
           {
            text:"Consultation",
            type:featureType.TEXT
           },

           {
            text:"Basic emergency care",
            type:featureType.TEXT
           },

           {
            text: "Prescription of drugs",
            type:featureType.TEXT
           },
    
           {
            text: "Preventive care including immunization",
            type:featureType.TEXT
           },

           {
            text: "Dressing of simple wounds and burns",
            type:featureType.TEXT
           },

           {
            text: "O & G care including ante natal care",
            type:featureType.TEXT
           },

           {
            text: "Minor surgical procedure",
            type:featureType.TEXT
           },


           {
            text: "Dental to cover consultations, Oral examination and Pain relief olive",
            type:featureType.TEXT
           },
           
           {
            text: "Treatments of simple eye ailment excluding lenses",
            type:featureType.TEXT
           },


           {
            text: "Medical emergencies (inpatients)",
            type:featureType.SUBHEADER
           },

           {
            text: "Hospital accommodation without feeding in an open general ward",
            type:featureType.TEXT
           },

           {
            text: "Nursing and medical care",
            type:featureType.TEXT
           },

           {
            text:  "Supply of prescription drugs and other consumables",
            type:featureType.TEXT
           },

           {
            text: "Diagnostic tests (X-ray & Lab)",
            type:featureType.TEXT
           },

           {
            text: "Surgical operations and theatre services for minor surgery.",
            type:featureType.TEXT
           },

           {
            text: "Obstetric and gynecological care including   non-complicated delivery for a registered spouse",
            type:featureType.TEXT
           },
        
    ]


const SAPPHIRE:plans =  [
            ...TOPAZ,
            {
                text: AllPlans.SAPPHIRE,
                type:featureType.HEADER
             },

             {
                text: "All that is covered under TOPAZ plus provision of lenses for eye treatment.",
                type:featureType.TEXT
            },

            {
                text: "General ward for 12 cumulative days",
                type:featureType.TEXT
            },

            {
                text: "I.C.U 1-24 hours with a limit of 50,000",
                type:featureType.TEXT
            },

            {
                text:"Surgical procedure limit of 150,000",
                type:featureType.TEXT
            },

            {
                text: "Optical lenses limit of 10,000",
                type:featureType.TEXT
            },

            {
                text: "Dental surgical extract limit of 10,000",
                type:featureType.TEXT
            },

            {
                text: "CT Scan (Emergency only)",
                type:featureType.TEXT
            },

            {
                text: "Physiotherapy session of 3",
                type:featureType.TEXT
            },

            {
                text: "Avoid medical examination of 50% copayment on investigation.",
                type:featureType.TEXT
            },

            {
                text: "Ambulances Services –Hospital –Hospital only",
                type:featureType.TEXT
            },
       
            {
                text: "Mortuary Services -5 days only.",
                type:featureType.TEXT
            },    
            
    ]


const EMERALD:plans = [

    ...SAPPHIRE,

    {
        text: AllPlans.EMERALD,
        type:featureType.HEADER
    },  

    {
        text: "General and specialist consultation -10",
        type:featureType.TEXT
    },  

    {
        text: "General and semi-private ward -15 days ",
        type:featureType.TEXT
    },  

    {
        text: "Major surgical limits of N200,000",
        type:featureType.TEXT
    },  

    {
        text: "Optical lenses limit- 15,000",
        type:featureType.TEXT
    },  

    {
        text: "Denture and bridges- 50% covered",
        type:featureType.TEXT
    },  

    {
        text: "Physiotherapy session 5 times",
        type:featureType.TEXT
    },  

    {
        text: "Annual Medical Examination copayment 45%",
        type:featureType.TEXT
    },  

    {
        text: "Infertility Investigation covered",
        type:featureType.TEXT
    },  

]

const RUBY = [
    ...EMERALD,

    {
        text: "RUBY",
        type:featureType.HEADER
    },  


    {
        text: "Consultation with specialist (15 times)",
        type:featureType.TEXT
    },  

    {
        text: "Semi private Ward for 18 days cumulative",
        type:featureType.TEXT
    },  

    {
        text: "Surgical services- N400,000 limit",
        type:featureType.TEXT
    },  

    {
        text: "Denture and bridges 60%",
        type:featureType.TEXT
    },  

    {
        text: "Surgical Extraction – N30,000",
        type:featureType.TEXT
    },  

    {
        text: "Electrocardiography 50%",
        type:featureType.TEXT
    },  

    {
        text: "Physiotherapy – 10 sessions",
        type:featureType.TEXT
    },  

    {
        text: "Annual Medical Examination 35% copayment",
        type:featureType.TEXT
    },  

    {
        text: "Mortuary services 15 days ",
        type:featureType.TEXT
    },  


]

const DIAMOND = [
  
    ...RUBY,

    {
        text: AllPlans.DIAMOND,
        type:featureType.HEADER
    }, 


    {
        text: "Surgical services N600,000 limit",
        type:featureType.TEXT
    }, 

    {
        text: "Denture & bridges 80% covered",
        type:featureType.TEXT
    }, 

    {
        text: "Surgical extraction- N50,000",
        type:featureType.TEXT
    }, 

    {
        text: "Electrocardiography 70% covered ",
        type:featureType.TEXT
    }, 

    {
        text: "Physiotherapy 15 sessions",
        type:featureType.TEXT
    }, 

    {
        text: "Annual Medical Examination 15% copayment",
        type:featureType.TEXT
    }, 
]


export default {
      TOPAZ,
      SAPPHIRE,
      RUBY,
      EMERALD,
      DIAMOND
}