import regeneratorRuntime from 'regenerator-runtime';
import request from 'request';
import { fetchAssets } from '../utils';

require('dotenv').config();
const Airtable = require('airtable');

const AIRTABLE_BASE_ASSETS_ROPSTEN = 'appgmqryjeBhR6fzy';
const AIRTABLE_BASE_ASSETS_MAINNET = 'app98ncQl4JjSLBNA';

export let assetListings;
const calledGetAssets = false;
// TODO Change to AIRTABLE_BASE_ASSETS_MAINNET once live on mainnet
const base = new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(AIRTABLE_BASE_ASSETS_MAINNET);

const getOperators = async () => new Promise(async (resolve, reject) => {
  const operators = {};
  base('Operators').select().eachPage((records, fetchNextPage) => {
    records.forEach((record) => {
      const address = record.get('Address');
      const name = record.get('Name');
      const files = record.get('Files');
      operators[address] = {
        name,
        files,
      };
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
  }, (error) => {
    if (error) {
      console.error(error);
      reject(error);
    } else {
      resolve(operators);
    }
  });
});


const getCorrectBase = (network) => {
  const baseId = network === 'ropsten' ? AIRTABLE_BASE_ASSETS_ROPSTEN : AIRTABLE_BASE_ASSETS_MAINNET;
  return new Airtable({ apiKey: process.env.AIRTABLE_KEY }).base(baseId);
};

const getAssetListingRecord = async (assetId, network) => {
  let recordId;
  const base = getCorrectBase(network);
  const records = await base('Asset Listings').select({ filterByFormula: `{Asset ID} = "${assetId}"` }).firstPage();
  if (!records.length) { return null; }
  return records[0];
};

export const updateAssetListing = async (data, network) => {
  const {
    assetId, files, risks, about, financials, fees,
  } = data;
  let recordId;
  const base = getCorrectBase(network);
  base('Asset Listings').select().eachPage((records, fetchNextPage) => {
    records.forEach((record) => {
      if (record.get('Asset ID') === assetId) {
        recordId = record.id;
      }
    });
    fetchNextPage();
  });
};

export const updateAssetFiles = async (data, network) => {
  const { assetId, files } = data;
  const record = await getAssetListingRecord(assetId, network);
  const base = getCorrectBase(network);

  await base('Asset Listings').update([{
    'id': record.id,
    'fields': {
      'Files': files.map(file => ({
        url: file.secure_url,
        filename: file.original_extension ? `${file.original_filename}.${file.original_extension}` : file.original_filename,
      })),
    },
  }]);
};

export const updateCoverPicture = async (data, network) => {
  const { assetId, file } = data;
  const record = await getAssetListingRecord(assetId, network);
  const base = getCorrectBase(network);
  await base('Asset Listings').update([{
    'id': record.id,
    'fields': {
      'Cover Picture': [{
        url: file.secure_url,
        filename: file.original_filename,
      }],
    },
  }]);
};

const getAssetListings = () => new Promise(async (resolve, reject) => {
  const assetListings = {};
  base('Asset Listings').select().eachPage((records, fetchNextPage) => {
    records.forEach((record) => {
      const assetId = record.get('Asset ID');
      const name = record.get('Asset Name');
      const financials = record.get('Financials');
      const risks = record.get('Risks');
      const about = record.get('About');
      const fees = record.get('Fees');
      const city = record.get('City');
      const country = record.get('Country');
      const files = record.get('Files');
      const coverPicture = record.get('Cover Picture');
      assetListings[assetId] = {
        name,
        files,
        financials,
        about,
        risks,
        fees,
        city,
        country,
        coverPicture,
      };
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.
    fetchNextPage();
  }, (error) => {
    if (error) {
      console.error(error);
      reject();
    } else {
      resolve(assetListings);
    }
  });
});
const getAllAssetsInfo = async (newAsset = false) => {
  try {
    [
      assetOperators,
      assetListings,
    ] = await Promise.all([
      getOperators,
      getAssetListings,
    ]);
  } catch (err) {
    setTimeout(getAllAssetsInfo, 2000);
  }
};

export const addNewAsset = async (data, network) => {
  try {
    const {
      assetId,
      country,
      city,
      name,
      about,
      financials,
      risks,
      fees,
    } = data;
    const base = getCorrectBase(network);
    const exists = await getAssetListingRecord(assetId, network);
    if (exists) {
      throw new Error('Asset record already exists!');
    }

    await base('Asset Listings').create({
      'Asset ID': assetId,
      'Asset Name': name,
      'About': about,
      'Financials': financials,
      'Risks': risks,
      'Fees': fees,
      'City': city,
      'Country': country,
    });

    // force refresh assets in the server
    getAllAssetsInfo(true);
  } catch (err) {
    console.error(err);
  }
};


export const pipeAssetListings = network => request(`https://api.airtable.com/v0/${network === 'ropsten' ? AIRTABLE_BASE_ASSETS_ROPSTEN : AIRTABLE_BASE_ASSETS_MAINNET}/Asset%20Listings?api_key=${process.env.AIRTABLE_KEY}`);

export const pipeOperators = network => request(`https://api.airtable.com/v0/${network === 'ropsten' ? AIRTABLE_BASE_ASSETS_ROPSTEN : AIRTABLE_BASE_ASSETS_MAINNET}/Operators?api_key=${process.env.AIRTABLE_KEY}`);

getAllAssetsInfo();
setTimeout(getAllAssetsInfo, 10000);
