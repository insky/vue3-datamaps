/*
  Getter for value. If not declared on datumValue, look up the chain into optionsValue
*/
function val(datumValue, optionsValue, context) {
  if (typeof context === 'undefined') {
    context = optionsValue; // eslint-disable-line no-param-reassign
    optionsValue = undefined; // eslint-disable-line no-param-reassign
  }
  const value = typeof datumValue !== 'undefined' ? datumValue : optionsValue;

  if (typeof value === 'undefined') {
    return null;
  }

  if (typeof value === 'function') {
    let fnContext = [ context ];
    if (context.geography) {
      fnContext = [ context.geography, context.data ];
    }
    return value.apply(null, fnContext);
  } else {
    return value;
  }
}

const regions = [
  {
    name: 'N. Virginia',
    full_name: 'US East (N. Virginia)',
    code: 'us-east-1',
    key: 'USE1',
    public: true,
    zones: [
      'us-east-1a',
      'us-east-1b',
      'us-east-1c',
      'us-east-1d',
      'us-east-1e',
      'us-east-1f'
    ],
    coordinates: {
      longitude: -90.20607,
      latitude: 39.94600
    }
  },
  {
    name: 'Ohio',
    full_name: 'US East (Ohio)',
    key: 'USE2',
    code: 'us-east-2',
    public: true,
    zones: [
      'us-east-2a',
      'us-east-2b',
      'us-east-2c'
    ],
    coordinates: {
      longitude: -89.46344,
      latitude: 41.50396
    }
  },
  {
    name: 'N. California',
    full_name: 'US West (N. California)',
    key: 'USW1',
    code: 'us-west-1',
    public: true,
    zone_limit: 2,
    zones: [
      'us-west-1a',
      'us-west-1b',
      'us-west-1c'
    ],
    coordinates: {
      longitude: -92.57275,
      latitude: 38.62998
    }
  },
  {
    name: 'Oregon',
    full_name: 'US West (Oregon)',
    key: 'USW2',
    code: 'us-west-2',
    public: true,
    zones: [
      'us-west-2a',
      'us-west-2b',
      'us-west-2c',
      'us-west-2d'
    ],
    coordinates: {
      longitude: -122.62206,
      latitude: 45.32745
    }
  },
  {
    name: 'GovCloud West',
    full_name: 'AWS GovCloud (US)',
    key: 'UGW1',
    code: 'us-gov-west-1',
    public: false,
    zones: [
      'us-gov-west-1a',
      'us-gov-west-1b',
      'us-gov-west-1c'
    ],
    coordinates: {
      longitude: -97.09434,
      latitude: 31.78395
    }
  },
  {
    name: 'GovCloud East',
    full_name: 'AWS GovCloud (US-East)',
    key: 'UGE1',
    code: 'us-gov-east-1',
    public: false,
    zones: [
      'us-gov-east-1a',
      'us-gov-east-1b',
      'us-gov-east-1c'
    ],
    coordinates: {
      longitude: -109.99673,
      latitude: 53.26630
    }
  },
  {
    name: 'Canada',
    full_name: 'Canada (Central)',
    key: 'CAN1',
    code: 'ca-central-1',
    public: true,
    zones: [
      'ca-central-1a',
      'ca-central-1b'
    ],
    coordinates: {
      longitude: -105.53215,
      latitude: 50.40277
    }
  },
  {
    name: 'Stockholm',
    full_name: 'EU (Stockholm)',
    key: 'EUN1',
    code: 'eu-north-1',
    public: true,
    zones: [
      'eu-north-1a',
      'eu-north-1b',
      'eu-north-1c'
    ],
    coordinates: {
      longitude: 18.04856,
      latitude: 59.33097
    }
  },
  {
    name: 'Ireland',
    full_name: 'EU (Ireland)',
    key: 'EU',
    code: 'eu-west-1',
    public: true,
    zones: [
      'eu-west-1a',
      'eu-west-1b',
      'eu-west-1c'
    ],
    coordinates: {
      longitude: -6.266155,
      latitude: 53.350140
    }
  },
  {
    name: 'London',
    full_name: 'EU (London)',
    key: 'EUW2',
    code: 'eu-west-2',
    public: true,
    zones: [
      'eu-west-2a',
      'eu-west-2b',
      'eu-west-2c'
    ],
    coordinates: {
      longitude: -0.11362,
      latitude: 51.51768
    }
  },
  {
    name: 'Paris',
    full_name: 'EU (Paris)',
    key: 'EUW3',
    code: 'eu-west-3',
    public: true,
    zones: [
      'eu-west-3a',
      'eu-west-3b',
      'eu-west-3c'
    ],
    coordinates: {
      longitude: 2.34293,
      latitude: 48.85717
    }
  },
  {
    name: 'Frankfurt',
    full_name: 'EU (Frankfurt)',
    key: 'EUC1',
    code: 'eu-central-1',
    public: true,
    zones: [
      'eu-central-1a',
      'eu-central-1b',
      'eu-central-1c'
    ],
    coordinates: {
      longitude: 8.65399,
      latitude: 50.12581
    }
  },
  {
    name: 'Tokyo',
    full_name: 'Asia Pacific (Tokyo)',
    key: 'APN1',
    code: 'ap-northeast-1',
    public: true,
    zone_limit: 3,
    zones: [
      'ap-northeast-1a',
      'ap-northeast-1b',
      'ap-northeast-1c',
      'ap-northeast-1d'
    ],
    coordinates: {
      longitude: 139.68872,
      latitude: 35.68052
    }
  },
  {
    name: 'Seoul',
    full_name: 'Asia Pacific (Seoul)',
    key: 'APN2',
    code: 'ap-northeast-2',
    public: true,
    zones: [
      'ap-northeast-2a',
      'ap-northeast-2b',
      'ap-northeast-2c'
    ],
    coordinates: {
      longitude: 126.99272,
      latitude: 37.57444
    }
  },
  {
    name: 'Osaka',
    full_name: 'Asia Pacific (Osaka-Local)',
    key: 'APN3',
    code: 'ap-northeast-3',
    public: false,
    zones: [
      'ap-northeast-3a'
    ],
    coordinates: {
      longitude: 135.50674,
      latitude: 34.69857
    }
  },
  {
    name: 'Singapore',
    full_name: 'Asia Pacific (Singapore)',
    key: 'APS1',
    code: 'ap-southeast-1',
    public: true,
    zones: [
      'ap-southeast-1a',
      'ap-southeast-1b',
      'ap-southeast-1c'
    ],
    coordinates: {
      longitude: 103.851959,
      latitude: 1.290270
    }
  },
  {
    name: 'Sydney',
    full_name: 'Asia Pacific (Sydney)',
    key: 'APS2',
    code: 'ap-southeast-2',
    public: true,
    zones: [
      'ap-southeast-2a',
      'ap-southeast-2b',
      'ap-southeast-2c'
    ],
    coordinates: {
      longitude: -60.18560,
      latitude: 46.13527
    }
  },
  {
    name: 'Hong Kong',
    full_name: 'Asia Pacific (Hong Kong)',
    key: 'APE1',
    code: 'ap-east-1',
    public: true,
    zones: [
      'ap-east-1a',
      'ap-east-1b',
      'ap-east-1c'
    ],
    coordinates: {
      longitude: 114.13624,
      latitude: 22.25424
    }
  },
  {
    name: 'Mumbai',
    full_name: 'Asia Pacific (Mumbai)',
    key: 'APS3',
    code: 'ap-south-1',
    public: true,
    zones: [
      'ap-south-1a',
      'ap-south-1b',
      'ap-south-1c'
    ],
    coordinates: {
      longitude: 72.86730,
      latitude: 19.07257
    }
  },
  {
    name: 'São Paulo',
    full_name: 'South America (São Paulo)',
    key: 'SAE1',
    code: 'sa-east-1',
    public: true,
    zone_limit: 2,
    zones: [
      'sa-east-1a',
      'sa-east-1b',
      'sa-east-1c'
    ],
    coordinates: {
      longitude: -37.54154,
      latitude: -10.54420
    }
  },
  {
    name: 'Bahrain',
    full_name: 'Middle East (Bahrain)',
    key: 'MES1',
    code: 'me-south-1',
    public: true,
    zones: [
      'me-south-1a',
      'me-south-1b',
      'me-south-1c'
    ],
    coordinates: {
      longitude: 25.9304142,
      latitude: 50.6377716
    }
  },
  {
    name: 'Beijing',
    full_name: 'China (Beijing)',
    key: 'CNN1',
    code: 'cn-north-1',
    public: false,
    zones: [
      'cn-north-1a',
      'cn-north-1b'
    ],
    coordinates: {
      longitude: 116.38570,
      latitude: 39.90388
    }
  },
  {
    name: 'Ningxia',
    full_name: 'China (Ningxia)',
    key: 'CNN1',
    code: 'cn-northwest-1',
    public: false,
    zones: [
      'cn-northwest-1a',
      'cn-northwest-1b',
      'cn-northwest-1c'
    ],
    coordinates: {
      longitude: 106.249290,
      latitude: 38.488800
    }
  }
];

export {
  val,
  regions
};
