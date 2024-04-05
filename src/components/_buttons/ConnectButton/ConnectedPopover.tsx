///Users/henriots/Desktop/sommelier-strangelove-1/src/components/_buttons/ConnectButton/ConnectedPopover.tsx
import {
  Avatar,
  HStack,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Stack,
} from "@chakra-ui/react";
import { Link } from "components/Link";
import truncateWalletAddress from "src/utils/truncateWalletAddress";
import {
  useAccount,
  useDisconnect,
  useEnsAvatar,
  useEnsName,
  useNetwork,
} from "wagmi";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { BaseButton } from "../BaseButton";
import { ChevronDownIcon, LogoutCircleIcon } from "components/_icons";
import { analytics } from "utils/analytics";
import { useImportToken } from "hooks/web3/useImportToken";
import { cellarDataMap } from "data/cellarDataMap";
import { useBrandedToast } from "hooks/chakra";
import { useRouter } from "next/router";
import { CellarNameKey } from "data/types";
import { chainConfig } from "data/chainConfig";
import { tokenConfig } from "data/tokenConfig";

export const ConnectedPopover = () => {
  const { addToast, close } = useBrandedToast();
  const { disconnect } = useDisconnect();
  const { address, isConnecting } = useAccount();
  const { data: ensName, isLoading: ensNameLoading } = useEnsName({
    address,
  });
  const { data: ensAvatar, isLoading: ensAvatarLoading } =
    useEnsAvatar({ address });
  const importToken = useImportToken({
    onSuccess: (data) => {
      addToast({
        heading: "Import Token",
        status: "success",
        body: <Text>{data.symbol} added to Metamask</Text>,
        closeHandler: close,
      });
    },
    onError: (error) => {
      const e = error as Error;
      addToast({
        heading: "Import Token",
        status: "error",
        body: <Text>{e.message}</Text>,
        closeHandler: close,
      });
    },
  });

  const { chain } = useNetwork();
  const chainObj = chainConfig.find((c) => c.wagmiId === chain?.id);
  const sommToken = tokenConfig.find(
    (t) => t.coinGeckoId === "sommelier" && t.chain === chainObj?.id
  );

  const avatarSrc = sommToken ? sommToken.src : "/assets/icons/somm.svg";

  const id = useRouter().query.id as string | undefined;
  const selectedStrategy = (!!id && cellarDataMap[id]) || undefined;

  function onDisconnect() {
    analytics.track("wallet.disconnected", {
      account: address,
    });
    disconnect();
    window.location.reload();
  }

  const walletAddressIcon = () => {
    if (ensAvatar) {
      return <Avatar boxSize={"16px"} src={ensAvatar} />;
    } else if (address) {
      return <Jazzicon diameter={16} seed={jsNumberForAddress(address)} />;
    } else {
      return <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#EEE" }}></div>;
    }
  };

  const handleCopyAddressToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      addToast({
        heading: "Copied to clipboard",
        body: <Text>Wallet address copied to clipboard</Text>,
        status: "success",
      });
    }
  };

  const isLoading = isConnecting && !address;
  const isEnsLoading = ensAvatarLoading || ensNameLoading;

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <BaseButton
          bg="none"
          borderWidth={2}
          borderColor="purple.base"
          borderRadius="full"
          rightIcon={
            <HStack>
              {walletAddressIcon()}
              <ChevronDownIcon />
            </HStack>
          }
          w="auto"
          zIndex={401}
          isLoading={isLoading}
          leftIcon={isLoading || isEnsLoading ? <Spinner size="xs" /> : undefined}
          fontFamily="Haffer"
          fontSize={12}
          _hover={{
            bg: "purple.dark",
          }}
        >
          {ensName ? ensName : truncateWalletAddress(address)}
        </BaseButton>
      </PopoverTrigger>
      <PopoverContent
        p={2}
        maxW="max-content"
        borderWidth={1}
        borderColor="purple.dark"
        borderRadius={12}
        bg="surface.bg"
        fontWeight="semibold"
        _focus={{
          outline: "unset",
          outlineOffset: "unset",
          boxShadow: "unset",
        }}
      >
        <PopoverBody p={0}>
          <Stack>
            <Link
              href={`${chain?.blockExplorers?.default.url}/address/${address}`}
              isExternal
              py={2}
              px={4}
              fontSize="sm"
              _hover={{
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <LogoutCircleIcon mr={2} />
              {`View on ${chain?.blockExplorers?.default.name}`}
            </Link>
            <HStack
              as="button"
              py={2}
              px={4}
              fontSize="sm"
              onClick={handleCopyAddressToClipboard}
              _hover={{
                cursor: "pointer",
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <LogoutCircleIcon />
              <Text fontWeight="semibold">Copy to clipboard</Text>
            </HStack>
            <HStack
              as="button"
              py={2}
              px={4}
              fontSize="sm"
              onClick={onDisconnect}
              _hover={{
                cursor: "pointer",
                bg: "purple.dark",
                borderColor: "surface.tertiary",
              }}
            >
              <LogoutCircleIcon />
              <Text fontWeight="semibold">Disconnect Wallet</Text>
            </HStack>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
