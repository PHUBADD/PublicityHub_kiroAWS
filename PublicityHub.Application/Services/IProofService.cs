using PublicityHub.Application.DTOs.Proofs;

public interface IProofService
{
    Task<ProofDto> UploadAsync(CreateProofDto dto);

    Task ApproveAsync(int proofId);
    Task RejectAsync(int proofId);

    Task<ProofDto?> GetByAssignmentAsync(int assignmentId);
}
